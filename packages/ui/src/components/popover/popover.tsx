"use client"

import type { ComponentProps, ReactNode, RefObject } from "react"
import type { ThemeProps } from "../../core/define"
import type { PopoverStyle } from "./popover.style"
import type { FloatingPlacement } from "./use-floating"
import { useCallback, useId, useMemo, useRef, useState } from "react"
import { createSlotComponent } from "../../core/create-component"
import { popoverStyle } from "./popover.style"

export interface PopoverContextValue {
  closeOnBlur: boolean
  closeOnEsc: boolean
  contentId: string
  gutter: number
  open: boolean
  panelRef: RefObject<HTMLDivElement | null>
  placement: FloatingPlacement
  triggerRef: RefObject<HTMLElement | null>
  setOpen: (open: boolean) => void
}

const {
  ComponentContext,
  PropsContext,
  useComponentContext,
  withContext,
  withProvider,
} = createSlotComponent<
  ComponentProps<"div">,
  PopoverStyle,
  PopoverContextValue
>("popover", popoverStyle)

export {
  ComponentContext as PopoverContext,
  useComponentContext as usePopoverContext,
  withContext as withPopoverContext,
  withProvider as withPopoverProvider,
}

export interface PopoverRootProps extends ThemeProps<PopoverStyle> {
  children?: ReactNode
  /** Dismiss when clicking or tapping outside the popover. @default true */
  closeOnBlur?: boolean
  /** Dismiss when pressing the Escape key. @default true */
  closeOnEsc?: boolean
  /** Initial open state when uncontrolled. @default false */
  defaultOpen?: boolean
  /** Gap between the trigger and popover panel in pixels. @default 6 */
  gutter?: number
  /** Controlled open state. */
  open?: boolean
  /** Preferred placement relative to the trigger. @default "bottom" */
  placement?: FloatingPlacement
  /** Invoked when open state changes. */
  onOpenChange?: (open: boolean) => void
}

/** Coordinates open state, anchored positioning, and shared styling for a popover. */
export function PopoverRoot({
  size,
  children,
  closeOnBlur = true,
  closeOnEsc = true,
  defaultOpen = false,
  gutter = 6,
  open: controlledOpen,
  placement = "bottom",
  onOpenChange,
}: PopoverRootProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const contentId = useId()
  const triggerRef = useRef<HTMLElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next)
      if (next !== open) onOpenChange?.(next)
    },
    [isControlled, onOpenChange, open],
  )

  const value = useMemo<PopoverContextValue>(
    () => ({
      closeOnBlur,
      closeOnEsc,
      contentId,
      gutter,
      open,
      panelRef,
      placement,
      setOpen,
      triggerRef,
    }),
    [closeOnBlur, closeOnEsc, contentId, gutter, open, placement, setOpen],
  )
  const styleProps = useMemo(() => ({ size }), [size])

  return (
    <PropsContext value={styleProps}>
      <ComponentContext value={value}>{children}</ComponentContext>
    </PropsContext>
  )
}
