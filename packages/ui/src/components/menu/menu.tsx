"use client"

import type { ComponentProps, ReactNode, RefObject } from "react"
import type { ThemeProps } from "../../core/define"
import type { FloatingPlacement } from "../popover/use-floating"
import type { MenuStyle } from "./menu.style"
import { useCallback, useId, useMemo, useRef, useState } from "react"
import { createSlotComponent } from "../../core/create-component"
import { menuStyle } from "./menu.style"

export type MenuOpenIntent = "first" | "last" | "trigger"

export interface MenuContextValue {
  closeOnBlur: boolean
  closeOnEsc: boolean
  closeOnSelect: boolean
  contentId: string
  gutter: number
  open: boolean
  openIntentRef: RefObject<MenuOpenIntent>
  panelRef: RefObject<HTMLDivElement | null>
  placement: FloatingPlacement
  triggerId: string
  triggerRef: RefObject<HTMLElement | null>
  setOpen: (open: boolean, intent?: MenuOpenIntent) => void
}

const {
  ComponentContext,
  PropsContext,
  useComponentContext,
  withContext,
  withProvider,
} = createSlotComponent<ComponentProps<"div">, MenuStyle, MenuContextValue>(
  "menu",
  menuStyle,
)

export {
  ComponentContext as MenuContext,
  useComponentContext as useMenuContext,
  withContext as withMenuContext,
  withProvider as withMenuProvider,
}

export interface MenuRootProps extends ThemeProps<MenuStyle> {
  children?: ReactNode
  /** Dismiss when clicking or tapping outside the menu. @default true */
  closeOnBlur?: boolean
  /** Dismiss when pressing the Escape key. @default true */
  closeOnEsc?: boolean
  /** Dismiss the menu after an item is selected. @default true */
  closeOnSelect?: boolean
  /** Initial open state when uncontrolled. @default false */
  defaultOpen?: boolean
  /** Gap between the trigger and menu panel in pixels. @default 6 */
  gutter?: number
  /** Controlled open state. */
  open?: boolean
  /** Preferred placement relative to the trigger. @default "bottom-start" */
  placement?: FloatingPlacement
  /** Invoked when open state changes. */
  onOpenChange?: (open: boolean) => void
}

/** Coordinates menu open state, keyboard open intent, anchored placement, and item styling. */
export function MenuRoot({
  size,
  children,
  closeOnBlur = true,
  closeOnEsc = true,
  closeOnSelect = true,
  defaultOpen = false,
  gutter = 6,
  open: controlledOpen,
  placement = "bottom-start",
  onOpenChange,
}: MenuRootProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const contentId = useId()
  const triggerId = useId()
  const triggerRef = useRef<HTMLElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const openIntentRef = useRef<MenuOpenIntent>("trigger")

  const setOpen = useCallback(
    (next: boolean, intent: MenuOpenIntent = "trigger") => {
      if (next) openIntentRef.current = intent
      if (!isControlled) setUncontrolledOpen(next)
      if (next !== open) onOpenChange?.(next)
    },
    [isControlled, onOpenChange, open],
  )

  const value = useMemo<MenuContextValue>(
    () => ({
      closeOnBlur,
      closeOnEsc,
      closeOnSelect,
      contentId,
      gutter,
      open,
      openIntentRef,
      panelRef,
      placement,
      setOpen,
      triggerId,
      triggerRef,
    }),
    [
      closeOnBlur,
      closeOnEsc,
      closeOnSelect,
      contentId,
      gutter,
      open,
      placement,
      setOpen,
      triggerId,
    ],
  )
  const styleProps = useMemo(() => ({ size }), [size])

  return (
    <PropsContext value={styleProps}>
      <ComponentContext value={value}>{children}</ComponentContext>
    </PropsContext>
  )
}
