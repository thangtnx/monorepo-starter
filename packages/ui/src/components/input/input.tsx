"use client"

import type { ComponentProps } from "react"
import type { ComponentStyleProps } from "../../core/define"
import { ariaAttr, cx } from "@monorepo/utils"
import { splitStyleProps } from "../../core/split-style-props"
import { useFieldContext } from "../field/field-context"
import { inputStyle } from "./input.style"

export interface InputProps
  extends
    Omit<ComponentProps<"input">, "color" | "size">,
    ComponentStyleProps<typeof inputStyle> {
  /** The input id. When wrapped in a `Field`, set the id on `Field`. */
  id?: string
}

/** A single-line text input. Inside a `Field` it takes the field's id and state. */
export function Input(props: InputProps) {
  const field = useFieldContext()
  const [styleAttributes, rest] = splitStyleProps("input", inputStyle, {
    ...props,
    size: props.size ?? field?.size,
  })

  return (
    <input
      aria-invalid={ariaAttr(field?.invalid)}
      disabled={field?.disabled}
      readOnly={field?.readOnly}
      required={field?.required}
      {...styleAttributes}
      {...rest}
      id={field?.id ?? rest.id}
      aria-describedby={cx(field?.describedBy, rest["aria-describedby"])}
    />
  )
}
