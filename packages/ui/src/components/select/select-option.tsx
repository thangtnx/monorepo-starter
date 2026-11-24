"use client"

import type { ComponentProps, ReactNode } from "react"
import type { SelectOptionEntry } from "./select-options"
import { createContext, use } from "react"

interface SelectContextValue {
  active: string | undefined
  options: ReadonlyMap<string, SelectOptionEntry>
  selected: ReadonlySet<string>
  choose: (value: string) => void
  setActive: (value: string) => void
}

export const SelectContext = createContext<null | SelectContextValue>(null)

export interface SelectOptionProps extends Omit<
  ComponentProps<"div">,
  "children" | "id"
> {
  /** The visible option label. */
  children: ReactNode
  /** The unique submitted value. The empty string represents no selection. */
  value: string
  /**
   * Prevents this option from being selected.
   *
   * @default false
   */
  disabled?: boolean
  /** Plain text for typeahead when the label contains a custom component. */
  textValue?: string
}

export function SelectOption({
  children,
  value,
  onClick,
  onPointerMove,
  ...props
}: SelectOptionProps) {
  const context = use(SelectContext)
  const option = context?.options.get(value)
  if (!context || !option) return null

  const { id, disabled } = option
  const selected = context.selected.has(value)
  const { disabled: _disabled, textValue: _textValue, ...elementProps } = props

  return (
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus -- The combobox owns focus and handles option keys.
    <div
      {...elementProps}
      id={id}
      aria-disabled={disabled || undefined}
      aria-selected={selected}
      data-active={(!disabled && context.active === value) || undefined}
      data-part="option"
      role="option"
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented && !disabled) context.choose(value)
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event)
        if (!disabled && context.active !== value) context.setActive(value)
      }}
    >
      <span>{children}</span>
      {selected && (
        <svg
          aria-hidden="true"
          data-part="check"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 16 16"
        >
          <path d="m3.5 8.5 3 3 6-7" />
        </svg>
      )}
    </div>
  )
}
