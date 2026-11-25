"use client"

import type { ComponentProps, MouseEvent, ReactNode } from "react"
import { slotClassName } from "../../core/style-attributes"
import { useMenuContext, withMenuContext } from "./menu"

export interface MenuItemProps extends Omit<
  ComponentProps<"button">,
  "onSelect" | "type"
> {
  /** Overrides root `closeOnSelect` for this item. */
  closeOnSelect?: boolean
  /** Optional shortcut hint aligned to the trailing edge. */
  command?: ReactNode
  /** Leading icon or indicator element. */
  icon?: ReactNode
  /** Invoked when the item is activated. */
  onSelect?: () => void
}

const ItemSlot = withMenuContext<"button", ComponentProps<"button">>(
  "button",
  "item",
)()

/** Actionable item inside a menu. */
export function MenuItem({
  children,
  closeOnSelect,
  command,
  disabled,
  icon,
  onClick,
  onSelect,
  ...props
}: MenuItemProps) {
  const context = useMenuContext()

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      event.preventDefault()
      return
    }
    onClick?.(event)
    if (event.defaultPrevented) return
    onSelect?.()
    if (closeOnSelect ?? context?.closeOnSelect ?? true) context?.setOpen(false)
  }

  return (
    <ItemSlot
      type="button"
      role="menuitem"
      tabIndex={-1}
      {...props}
      aria-disabled={disabled || undefined}
      data-disabled={disabled || undefined}
      disabled={disabled}
      onClick={handleClick}
    >
      {icon != null && (
        <span className={slotClassName("menu", "indicator")} aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{children}</span>
      {command != null && (
        <span className={slotClassName("menu", "command")}>{command}</span>
      )}
    </ItemSlot>
  )
}
