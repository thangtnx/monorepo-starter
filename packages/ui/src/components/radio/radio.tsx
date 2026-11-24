"use client"

import type { ComponentProps } from "react"
import type { ComponentStyleProps } from "../../core/define"
import type { CheckableProps } from "../checkbox/checkbox-control"
import { use } from "react"
import { splitStyleProps } from "../../core/split-style-props"
import { CheckableFrame, useCheckable } from "../checkbox/checkbox-control"
import { RadioGroupContext } from "./radio-group-context"
import { radioStyle } from "./radio.style"

export interface RadioProps
  extends CheckableProps, ComponentStyleProps<typeof radioStyle> {
  /** Props for the decorative indicator. */
  indicatorProps?: ComponentProps<"span">
}

export function Radio({ size, indicatorProps, ...props }: RadioProps) {
  const group = use(RadioGroupContext)
  const [attributes, rest] = splitStyleProps("radio", radioStyle, {
    ...props,
    variant: props.variant ?? group?.appearance.variant,
    errorBorderColor:
      props.errorBorderColor ?? group?.appearance.errorBorderColor,
    focusBorderColor:
      props.focusBorderColor ?? group?.appearance.focusBorderColor,
    shape: props.shape ?? group?.appearance.shape,
  })
  const value = String(rest.inputProps?.value ?? rest.value ?? "on")
  const control = useCheckable(rest, {
    size,
    defaults: group?.defaults,
    selection: group?.managed
      ? {
          change: (checked) => {
            if (checked) group.select(value)
          },
          checked: group.value === value,
        }
      : undefined,
  })

  return (
    <CheckableFrame
      type="radio"
      attributes={attributes}
      control={control}
      indicator={
        <span {...indicatorProps} aria-hidden="true" data-part="indicator" />
      }
    />
  )
}
