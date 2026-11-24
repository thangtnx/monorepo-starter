"use client"

import type { FocusEvent, PointerEvent } from "react"
import { useCallback, useEffect, useRef, useState } from "react"

export interface RippleItem {
  duration: number
  key: number
  released: boolean
  size: number
  x: number
  y: number
}

export interface UseRippleProps<Element extends HTMLElement = HTMLElement> {
  /**
   * If `true`, pointer interactions do not spawn ripple waves.
   *
   * @default false
   */
  disabled?: boolean
  /** Existing blur handler to compose with ripple release. */
  onBlur?: (event: FocusEvent<Element>) => void
  /** Existing pointer-down handler to compose with ripple creation. */
  onPointerDown?: (event: PointerEvent<Element>) => void
  /** Existing pointer-leave handler to compose with ripple release. */
  onPointerLeave?: (event: PointerEvent<Element>) => void
}

const minHoldMs = 220
const fadeDurationMs = 320
const fallbackBufferMs = 400
const coreRatio = 0.7

/** Tracks click/pointer waves relative to the interactive container. */
export function useRipple<Element extends HTMLElement = HTMLElement>({
  disabled = false,
  onBlur,
  onPointerDown,
  onPointerLeave,
}: UseRippleProps<Element> = {}) {
  const [ripples, setRipples] = useState<RippleItem[]>([])
  const nextKey = useRef(0)
  const createdAt = useRef(new Map<number, number>())
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>[]>())
  const releaseCleanups = useRef(new Set<() => void>())

  const clearWaveTimers = useCallback((key: number) => {
    const list = timers.current.get(key)
    if (!list) return
    for (const timer of list) clearTimeout(timer)
    timers.current.delete(key)
  }, [])

  const pushTimer = useCallback(
    (key: number, timer: ReturnType<typeof setTimeout>) => {
      const list = timers.current.get(key) ?? []
      list.push(timer)
      timers.current.set(key, list)
    },
    [],
  )

  const onClear = useCallback(
    (key: number) => {
      clearWaveTimers(key)
      createdAt.current.delete(key)
      setRipples((previous) => previous.filter((item) => item.key !== key))
    },
    [clearWaveTimers],
  )

  const releaseWaves = useCallback(() => {
    const now = performance.now()
    for (const [key, start] of Array.from(createdAt.current.entries())) {
      createdAt.current.delete(key)
      const remaining = Math.max(0, minHoldMs - (now - start))
      const triggerRelease = () => {
        setRipples((previous) =>
          previous.map((item) =>
            item.key === key && !item.released
              ? { ...item, released: true }
              : item,
          ),
        )
        const cleanupTimer = setTimeout(
          () => onClear(key),
          fadeDurationMs + fallbackBufferMs,
        )
        pushTimer(key, cleanupTimer)
      }

      if (remaining <= 0) {
        triggerRelease()
      } else {
        const holdTimer = setTimeout(triggerRelease, remaining)
        pushTimer(key, holdTimer)
      }
    }
  }, [onClear, pushTimer])

  const resetAll = useCallback(() => {
    for (const key of timers.current.keys()) clearWaveTimers(key)
    createdAt.current.clear()
    for (const cleanup of releaseCleanups.current) cleanup()
    releaseCleanups.current.clear()
  }, [clearWaveTimers])

  useEffect(() => {
    if (!disabled) return
    resetAll()
    setRipples((previous) => (previous.length > 0 ? [] : previous))
  }, [disabled, resetAll])

  useEffect(() => resetAll, [resetAll])

  const handlePointerDown = useCallback(
    (event: PointerEvent<Element>) => {
      onPointerDown?.(event)
      if (disabled || event.defaultPrevented || event.button > 0) return

      const target = event.currentTarget
      const rect = target.getBoundingClientRect()
      const width = target.clientWidth || rect.width
      const height = target.clientHeight || rect.height
      const isSyntheticCenter =
        event.detail === 0 && event.clientX === 0 && event.clientY === 0
      const px = isSyntheticCenter
        ? width / 2
        : event.clientX - rect.left - target.clientLeft
      const py = isSyntheticCenter
        ? height / 2
        : event.clientY - rect.top - target.clientTop
      const radius = Math.hypot(
        Math.max(px, width - px),
        Math.max(py, height - py),
      )
      const size = Math.ceil((2 * radius) / coreRatio)
      const x = px - size / 2
      const y = py - size / 2
      const duration = Math.min(
        550,
        Math.max(320, Math.round(260 + radius * 1.2)),
      )

      nextKey.current += 1
      const key = nextKey.current
      createdAt.current.set(key, performance.now())

      const ownerWindow = target.ownerDocument.defaultView ?? window
      const handlePointerEnd = () => {
        cleanup()
        releaseWaves()
      }
      const cleanup = () => {
        ownerWindow.removeEventListener("pointerup", handlePointerEnd, true)
        ownerWindow.removeEventListener("pointercancel", handlePointerEnd, true)
        releaseCleanups.current.delete(cleanup)
      }
      ownerWindow.addEventListener("pointerup", handlePointerEnd, true)
      ownerWindow.addEventListener("pointercancel", handlePointerEnd, true)
      releaseCleanups.current.add(cleanup)

      setRipples((previous) => [
        ...previous,
        { key, size, duration, released: false, x, y },
      ])
    },
    [disabled, onPointerDown, releaseWaves],
  )

  const handlePointerLeave = useCallback(
    (event: PointerEvent<Element>) => {
      onPointerLeave?.(event)
      releaseWaves()
    },
    [onPointerLeave, releaseWaves],
  )

  const handleBlur = useCallback(
    (event: FocusEvent<Element>) => {
      onBlur?.(event)
      releaseWaves()
    },
    [onBlur, releaseWaves],
  )

  return {
    ripples,
    onBlur: handleBlur,
    onClear,
    onPointerDown: handlePointerDown,
    onPointerLeave: handlePointerLeave,
  }
}
