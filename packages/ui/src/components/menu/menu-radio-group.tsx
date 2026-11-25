"use client"

import type { ComponentProps, MouseEvent } from "react"
import { createContext, useContext, useState } from "react"
import { slotClassName } from "../../core/style-attributes"
import { Check, Icon } from "../icon"
import { useMenuContext, withMenuContext } from "./menu"

interface RadioGroupContextValue {
  value: string | undefined
  onSelectValue: (value: string) => void
}

const RadioGroupContext = createContext<RadioGroupContextValue | undefined>(
  undefined,
)

export interface MenuRadioGroupProps extends ComponentProps<"div"> {
  /** Initial selected value when uncontrolled. */
  defaultValue?: string
  /** Controlled selected value. */
  value?: string
  /** Invoked when selection changes. */
  onValueChange?: (value: string) => void
}

const GroupSlot = withMenuContext<"div", ComponentProps<"div">>(
  "div",
  "group",
)()

/** Mutually exclusive group of radio menu items. */
export function MenuRadioGroup({
  children,
  defaultValue,
  value: controlledValue,
  onValueChange,
  ...props
}: MenuRadioGroupProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : uncontrolledValue

  const onSelectValue = (next: string) => {
    if (!isControlled) setUncontrolledValue(next)
    if (next !== value) onValueChange?.(next)
  }

  return (
    <RadioGroupContext value={{ value, onSelectValue }}>
      <GroupSlot role="group" {...props}>
        {children}
      </GroupSlot>
    </RadioGroupContext>
  )
}

export interface MenuRadioItemProps extends Omit<
  ComponentProps<"button">,
  "onSelect" | "type" | "value"
> {
  value: string
  /** Overrides root `closeOnSelect` for this item. */
  closeOnSelect?: boolean
}

const ItemSlot = withMenuContext<"button", ComponentProps<"button">>(
  "button",
  "item",
)()

/** Single selectable option inside a `Menu.RadioGroup`. */
export function MenuRadioItem({
  children,
  closeOnSelect,
  disabled,
  value,
  onClick,
  ...props
}: MenuRadioItemProps) {
  const context = useMenuContext()
  const radioGroup = useContext(RadioGroupContext)
  const checked = radioGroup?.value === value

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      event.preventDefault()
      return
    }
    onClick?.(event)
    if (event.defaultPrevented) return
    radioGroup?.onSelectValue(value)
    if (closeOnSelect ?? context?.closeOnSelect ?? true) context?.setOpen(false)
  }

  return (
    <ItemSlot
      type="button"
      role="menuitemradio"
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
