"use client"

import type {
  ComponentProps,
  FocusEvent,
  PointerEvent,
  ReactElement,
  ReactNode,
  Ref,
} from "react"
import type { ComponentStyleProps } from "../../core/define"
import type { FloatingPlacement } from "../popover/use-floating"
import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react"
import { mergeRefs } from "../../core/merge-props"
import { splitStyleProps } from "../../core/split-style-props"
import { useFloating } from "../popover/use-floating"
import { tooltipDefaults } from "./tooltip-config"
import { tooltipStyle } from "./tooltip.style"

interface TriggerChildProps {
  "aria-describedby"?: string
  ref?: Ref<HTMLElement>
  onBlur?: (event: FocusEvent<HTMLElement>) => void
  onFocus?: (event: FocusEvent<HTMLElement>) => void
  onPointerEnter?: (event: PointerEvent<HTMLElement>) => void
  onPointerLeave?: (event: PointerEvent<HTMLElement>) => void
}

export interface TooltipProps
  extends
    Omit<ComponentProps<"div">, "children" | "color" | "onChange">,
    ComponentStyleProps<typeof tooltipStyle> {
  /** Single interactive trigger element that receives hover and focus listeners. */
  children: ReactElement<TriggerChildProps>
  /** Descriptive text or content rendered inside the tooltip. */
  label: ReactNode
  /** Delay before hiding after pointer leaves, in milliseconds. @default 0 */
  closeDelay?: number
  /** Initial open state when uncontrolled. @default false */
  defaultOpen?: boolean
  /** Suppresses tooltip display when true. @default false */
  disabled?: boolean
  /** Gap between trigger and tooltip in pixels. @default 6 */
  gutter?: number
  /** Controlled open state. */
  open?: boolean
  /** Delay before showing on hover, in milliseconds. @default 150 */
  openDelay?: number
  /** Preferred placement relative to the trigger. @default "top" */
  placement?: FloatingPlacement
  /** Invoked when open state changes. */
  onOpenChange?: (open: boolean) => void
}

/** Accessible hover/focus label anchored to a trigger element via the Popover API. */
export function Tooltip({
  id,
  children,
  closeDelay = tooltipDefaults.closeDelay,
  defaultOpen = false,
  disabled = false,
  gutter = 6,
  label,
  open: controlledOpen,
  openDelay = tooltipDefaults.openDelay,
  placement = "top",
  onOpenChange,
  ...props
}: TooltipProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const openState = isControlled ? controlledOpen : uncontrolledOpen
  const hasLabel = label != null && label !== ""
  const open = !disabled && hasLabel && openState

  const generatedId = useId()
  const tooltipId = id ?? generatedId
  const triggerRef = useRef<HTMLElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  )
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  )

  const clearTimers = useCallback(() => {
    if (openTimerRef.current !== undefined) {
      clearTimeout(openTimerRef.current)
      openTimerRef.current = undefined
    }
    if (closeTimerRef.current !== undefined) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = undefined
    }
  }, [])

  useEffect(() => clearTimers, [clearTimers])

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next)
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange],
  )

  const handleImmediateClose = useCallback(() => {
    clearTimers()
    setOpen(false)
  }, [clearTimers, setOpen])

  const scheduleOpen = useCallback(
    (delay: number) => {
      clearTimers()
      if (disabled || !hasLabel) return
      if (delay <= 0) setOpen(true)
      else openTimerRef.current = setTimeout(() => setOpen(true), delay)
    },
    [clearTimers, disabled, hasLabel, setOpen],
  )

  const scheduleClose = useCallback(() => {
    clearTimers()
    if (closeDelay <= 0) setOpen(false)
    else closeTimerRef.current = setTimeout(() => setOpen(false), closeDelay)
  }, [clearTimers, closeDelay, setOpen])

  useFloating({
    closeOnBlur: false,
    closeOnEsc: true,
    gutter,
    open,
    panelRef,
    placement,
    restoreFocusOnEsc: false,
    triggerRef,
    onClose: handleImmediateClose,
  })

  const [styleAttributes, rest] = splitStyleProps(
    "tooltip",
    tooltipStyle,
    props,
  )

  const trigger = isValidElement<TriggerChildProps>(children)
    ? cloneElement(children, {
        ref: mergeRefs(triggerRef, children.props.ref),
        "aria-describedby": open
          ? tooltipId
          : children.props["aria-describedby"],
        onBlur: (event: FocusEvent<HTMLElement>) => {
          children.props.onBlur?.(event)
          scheduleClose()
        },
        onFocus: (event: FocusEvent<HTMLElement>) => {
          children.props.onFocus?.(event)
          scheduleOpen(0)
        },
        onPointerEnter: (event: PointerEvent<HTMLElement>) => {
          children.props.onPointerEnter?.(event)
          scheduleOpen(openDelay)
        },
        onPointerLeave: (event: PointerEvent<HTMLElement>) => {
          children.props.onPointerLeave?.(event)
          scheduleClose()
        },
      })
    : children

  return (
    <>
      {trigger}
      <div
        role="tooltip"
        {...styleAttributes}
        {...rest}
        id={tooltipId}
        ref={panelRef}
        data-open={open || undefined}
        hidden={!open}
        popover="manual"
      >
        {label}
      </div>
    </>
  )
}
