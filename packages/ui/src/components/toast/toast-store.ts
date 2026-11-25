import type { ReactNode } from "react"
import type { NoticeItemProps } from "../notice"
import { toastDefaults } from "./toast-config"

export type ToastStatus = "error" | "info" | "loading" | "success" | "warning"

export interface ToastOptions {
  closable?: boolean
  description?: ReactNode
  duration?: null | number
  id?: string
  status?: ToastStatus
  title?: ReactNode
  variant?: NoticeItemProps["variant"]
  onClose?: () => void
}

export interface ToastRecord {
  closable: boolean
  duration: null | number
  id: string
  status: ToastStatus
  variant: NoticeItemProps["variant"]
  description?: ReactNode
  title?: ReactNode
  onClose?: () => void
}

interface TimerState {
  remaining: number
  startedAt: number
  timeoutId?: ReturnType<typeof setTimeout>
}

export interface ToastStore {
  create: (options: ToastOptions) => string
  dismiss: (id: string) => void
  dismissAll: () => void
  error: (options: Omit<ToastOptions, "status">) => string
  getSnapshot: () => readonly ToastRecord[]
  info: (options: Omit<ToastOptions, "status">) => string
  loading: (options: Omit<ToastOptions, "status">) => string
  pause: () => void
  resume: () => void
  subscribe: (listener: () => void) => () => void
  success: (options: Omit<ToastOptions, "status">) => string
  update: (id: string, patch: Partial<ToastOptions>) => void
  warning: (options: Omit<ToastOptions, "status">) => string
}

let counter = 0

function resolveDuration(status: ToastStatus, explicit?: null | number) {
  if (explicit !== undefined) return explicit
  if (status === "error" || status === "loading") return null
  return toastDefaults.duration
}

export function createToastStore(): ToastStore {
  const listeners = new Set<() => void>()
  const timers = new Map<string, TimerState>()
  let records: ToastRecord[] = []
  let paused = false

  const emit = () => {
    records = [...records]
    for (const listener of listeners) listener()
  }

  const clearTimer = (id: string) => {
    const timer = timers.get(id)
    if (!timer) return
    if (timer.timeoutId !== undefined) clearTimeout(timer.timeoutId)
    timers.delete(id)
  }

  const dismiss = (id: string) => {
    const index = records.findIndex((item) => item.id === id)
    if (index === -1) return
    const [removed] = records.splice(index, 1)
    clearTimer(id)
    emit()
    removed?.onClose?.()
  }

  const scheduleTimer = (id: string, duration: null | number) => {
    clearTimer(id)
    if (duration === null || duration <= 0) return
    const entry: TimerState = {
      remaining: duration,
      startedAt: Date.now(),
    }
    if (!paused)
      entry.timeoutId = setTimeout(() => {
        dismiss(id)
      }, duration)
    timers.set(id, entry)
  }

  const create = (options: ToastOptions) => {
    const id = options.id ?? `ui-toast-${++counter}`
    const status = options.status ?? "info"
    const duration = resolveDuration(status, options.duration)
    const next: ToastRecord = {
      id,
      variant: options.variant ?? "subtle",
      closable: options.closable ?? true,
      description: options.description,
      duration,
      status,
      title: options.title,
      onClose: options.onClose,
    }
    const existingIndex = records.findIndex((item) => item.id === id)
    if (existingIndex === -1) records.push(next)
    else records[existingIndex] = next
    scheduleTimer(id, duration)
    emit()
    return id
  }

  const update = (id: string, patch: Partial<ToastOptions>) => {
    const existing = records.find((item) => item.id === id)
    if (!existing) return
    const status = patch.status ?? existing.status
    const duration =
      patch.duration !== undefined
        ? patch.duration
        : patch.status !== undefined
          ? resolveDuration(status)
          : existing.duration
    const updated: ToastRecord = {
      ...existing,
      ...patch,
      id,
      duration,
      status,
    }
    records = records.map((item) => (item.id === id ? updated : item))
    scheduleTimer(id, duration)
    emit()
  }

  const dismissAll = () => {
    for (const item of records) clearTimer(item.id)
    records = []
    emit()
  }

  const pause = () => {
    if (paused) return
    paused = true
    const now = Date.now()
    for (const timer of timers.values()) {
      if (timer.timeoutId !== undefined) {
        clearTimeout(timer.timeoutId)
        timer.timeoutId = undefined
      }
      timer.remaining = Math.max(0, timer.remaining - (now - timer.startedAt))
    }
  }

  const resume = () => {
    if (!paused) return
    paused = false
    const now = Date.now()
    for (const [id, timer] of timers.entries()) {
      timer.startedAt = now
      if (timer.remaining <= 0) dismiss(id)
      else
        timer.timeoutId = setTimeout(() => {
          dismiss(id)
        }, timer.remaining)
    }
  }

  return {
    create,
    dismiss,
    dismissAll,
    error: (options) => create({ ...options, status: "error" }),
    getSnapshot: () => records,
    info: (options) => create({ ...options, status: "info" }),
    loading: (options) => create({ ...options, status: "loading" }),
    pause,
    resume,
    subscribe: (listener) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    success: (options) => create({ ...options, status: "success" }),
    update,
    warning: (options) => create({ ...options, status: "warning" }),
  }
}

export const toast = createToastStore()
