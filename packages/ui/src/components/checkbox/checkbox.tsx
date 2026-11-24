"use client"

import type { ComponentProps, ReactNode } from "react"
import type { ComponentStyleProps } from "../../core/define"
import type { CheckableDefaults, CheckableProps } from "./checkbox-control"
import { createContext, use } from "react"
import { splitStyleProps } from "../../core/split-style-props"
import { CheckableFrame, useCheckable } from "./checkbox-control"
import { checkboxStyle } from "./checkbox.style"

export interface CheckboxProps
  extends CheckableProps, ComponentStyleProps<typeof checkboxStyle> {
  /** Replaces the check glyph. */
  checkedIcon?: ReactNode
  /** Shows and exposes the native mixed state. */
  indeterminate?: boolean
  /** Replaces the mixed glyph. */
  indeterminateIcon?: ReactNode
  /** Props for the decorative indicator. */
  indicatorProps?: ComponentProps<"span">
}

export const CheckboxGroupContext = createContext<
  | undefined
  | {
      appearance: ComponentStyleProps<typeof checkboxStyle> &
        Pick<CheckboxProps, "errorBorderColor" | "focusBorderColor">
      defaults: CheckableDefaults
      values: readonly string[]
      toggle: (value: string, checked: boolean) => void
      checkedIcon?: ReactNode
      max?: number
    }
>(undefined)

export function Checkbox({
  size,
  checkedIcon,
  indeterminate = false,
  indeterminateIcon = "−",
  indicatorProps,
  ...props
}: CheckboxProps) {
  const group = use(CheckboxGroupContext)
  const [attributes, rest] = splitStyleProps("checkbox", checkboxStyle, {
    ...group?.appearance,
    ...props,
  })
  const value = String(rest.inputProps?.value ?? rest.value ?? "on")
  const checked = group?.values.includes(value) ?? false
  const atLimit = group?.max !== undefined && group.values.length >= group.max
  const control = useCheckable(rest, {
    size,
    defaults: group && {
      ...group.defaults,
      disabled: group.defaults.disabled || (!checked && atLimit),
    },
    indeterminate,
    selection: group && {
      change: (next) => group.toggle(value, next),
      checked,
    },
  })
  const { checkedIcon: groupIcon = "✓" } = group ?? {}

  return (
    <CheckableFrame
      type="checkbox"
      attributes={attributes}
      control={control}
      indicator={
        <span {...indicatorProps} aria-hidden="true" data-part="indicator">
          <span data-icon="checked">
            {checkedIcon === undefined ? groupIcon : checkedIcon}
          </span>
          <span data-icon="mixed">{indeterminateIcon}</span>
        </span>
      }
    />
  )
}
