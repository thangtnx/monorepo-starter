"use client"

import type { ComponentProps, MouseEvent } from "react"
import { useState } from "react"
import { slotClassName } from "../../core/style-attributes"
import { Check, Icon } from "../icon"
import { useMenuContext, withMenuContext } from "./menu"

export interface MenuCheckboxItemProps extends Omit<
  ComponentProps<"button">,
  "onSelect" | "type"
> {
  /** Controlled checked state. */
  checked?: boolean
  /** Overrides root `closeOnSelect` for this item. */
  closeOnSelect?: boolean
  /** Initial checked state when uncontrolled. @default false */
  defaultChecked?: boolean
  /** Invoked when checked state toggles. */
  onCheckedChange?: (checked: boolean) => void
}

const ItemSlot = withMenuContext<"button", ComponentProps<"button">>(
  "button",
  "item",
)()

/** Checkable option inside a menu. */
export function MenuCheckboxItem({
  checked: controlledChecked,
  children,
  closeOnSelect,
  defaultChecked = false,
  disabled,
  onCheckedChange,
  onClick,
  ...props
}: MenuCheckboxItemProps) {
  const context = useMenuContext()
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked)
  const isControlled = controlledChecked !== undefined
  const checked = isControlled ? controlledChecked : uncontrolledChecked

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      event.preventDefault()
      return
    }
    onClick?.(event)
    if (event.defaultPrevented) return
    const next = !checked
    if (!isControlled) setUncontrolledChecked(next)
    onCheckedChange?.(next)
    if (closeOnSelect ?? context?.closeOnSelect ?? true) context?.setOpen(false)
  }

  return (
    <ItemSlot
      type="button"
      role="menuitemcheckbox"
      tabIndex={-1}
      {...props}
      aria-checked={checked}
      aria-disabled={disabled || undefined}
      data-checked={checked || undefined}
      data-disabled={disabled || undefined}
      disabled={disabled}
      onClick={handleClick}
    >
      <span className={slotClassName("menu", "indicator")} aria-hidden="true">
        {checked && <Icon as={Check} />}
      </span>
      <span>{children}</span>
    </ItemSlot>
  )
}
