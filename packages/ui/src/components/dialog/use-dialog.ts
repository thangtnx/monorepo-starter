"use client"

import type { RefObject } from "react"
import { useCallback, useEffect, useId, useRef, useState } from "react"

export interface UseDialogOptions {
  /** Lock document scrolling while the dialog is open. @default true */
  blockScrollOnMount?: boolean
  /** Close when the Escape key is pressed. @default true */
  closeOnEsc?: boolean
  /** Close when the backdrop behind the dialog is clicked. @default true */
  closeOnOverlayClick?: boolean
  /** Initial open state when uncontrolled. @default false */
  defaultOpen?: boolean
  /** Element to focus after the dialog closes. Overrides trigger restoration. */
  finalFocusRef?: RefObject<HTMLElement | null>
  /** Element to focus when the dialog opens. */
  initialFocusRef?: RefObject<HTMLElement | null>
  /** Controlled open state. */
  open?: boolean
  /** Callback invoked when open state changes. */
  onOpenChange?: (open: boolean) => void
}

export interface DialogContextValue {
  blockScrollOnMount: boolean
  closeOnEsc: boolean
  closeOnOverlayClick: boolean
  contentId: string
  descriptionId: string
  dialogRef: RefObject<HTMLDialogElement | null>
  finalFocusRef: RefObject<HTMLElement | null> | undefined
  hasDescription: boolean
  hasTitle: boolean
  initialFocusRef: RefObject<HTMLElement | null> | undefined
  open: boolean
  titleId: string
  triggerRef: RefObject<HTMLElement | null>
  setHasDescription: (present: boolean) => void
  setHasTitle: (present: boolean) => void
  setOpen: (open: boolean) => void
}

let scrollLockCount = 0
let savedOverflow = ""

function lockScroll() {
  if (scrollLockCount === 0) {
    savedOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = "hidden"
  }
  scrollLockCount += 1
}

function unlockScroll() {
  if (scrollLockCount === 0) return
  scrollLockCount -= 1
  if (scrollLockCount === 0)
    document.documentElement.style.overflow = savedOverflow
}

export function useDialog({
  blockScrollOnMount = true,
  closeOnEsc = true,
  closeOnOverlayClick = true,
  defaultOpen = false,
  finalFocusRef,
  initialFocusRef,
  open: controlledOpen,
  onOpenChange,
}: UseDialogOptions = {}): DialogContextValue {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const [hasTitle, setHasTitle] = useState(false)
  const [hasDescription, setHasDescription] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const contentId = useId()
  const titleId = useId()
  const descriptionId = useId()
  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next)
      if (next !== open) onOpenChange?.(next)
    },
    [isControlled, onOpenChange, open],
  )

  return {
    blockScrollOnMount,
    closeOnEsc,
    closeOnOverlayClick,
    contentId,
    descriptionId,
    dialogRef,
    finalFocusRef,
    hasDescription,
    hasTitle,
    initialFocusRef,
    open,
    setHasDescription,
    setHasTitle,
    setOpen,
    titleId,
    triggerRef,
  }
}

export function useDialogEffect({
  blockScrollOnMount,
  dialogRef,
  finalFocusRef,
  initialFocusRef,
  open,
  triggerRef,
}: Pick<
  DialogContextValue,
  | "blockScrollOnMount"
  | "dialogRef"
  | "finalFocusRef"
  | "initialFocusRef"
  | "open"
  | "triggerRef"
>) {
  const wasOpenRef = useRef(false)
  const lockedRef = useRef(false)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open) {
      if (!wasOpenRef.current) {
        const active =
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null
        previousFocusRef.current =
          active &&
          active !== document.body &&
          active !== document.documentElement
            ? active
            : triggerRef.current
        wasOpenRef.current = true
      }

      if (typeof dialog.showModal === "function") {
        if (!dialog.open) dialog.showModal()
      } else {
        dialog.setAttribute("open", "")
      }

      if (blockScrollOnMount && !lockedRef.current) {
        lockScroll()
        lockedRef.current = true
      }

      if (initialFocusRef?.current) initialFocusRef.current.focus()
      else if (typeof dialog.showModal !== "function") dialog.focus()

      return
    }

    if (wasOpenRef.current) {
      wasOpenRef.current = false
      if (typeof dialog.close === "function") {
        if (dialog.open) dialog.close()
      } else {
        dialog.removeAttribute("open")
      }

      if (lockedRef.current) {
        unlockScroll()
        lockedRef.current = false
      }

      const restoreTarget =
        finalFocusRef?.current ?? previousFocusRef.current ?? triggerRef.current
      previousFocusRef.current = null
      if (restoreTarget?.isConnected) restoreTarget.focus()
    }
  }, [
    blockScrollOnMount,
    dialogRef,
    finalFocusRef,
    initialFocusRef,
    open,
    triggerRef,
  ])

  useEffect(
    () => () => {
      if (lockedRef.current) {
        unlockScroll()
        lockedRef.current = false
      }
    },
    [],
  )
}
