"use client"

import type { ComponentProps } from "react"
import type { ComponentStyleProps } from "../../core/define"
import { ariaAttr, cx } from "@monorepo/utils"
import { splitStyleProps } from "../../core/split-style-props"
import { useFieldContext } from "../field/field-context"
import { textareaStyle } from "./textarea.style"

export interface TextareaProps
  extends
    Omit<ComponentProps<"textarea">, "color">,
    ComponentStyleProps<typeof textareaStyle> {
  /** The textarea id. When wrapped in a Field, set the id on Field. */
  id?: string
}

export function Textarea(props: TextareaProps) {
  const field = useFieldContext()
  const [styleAttributes, rest] = splitStyleProps("textarea", textareaStyle, {
    ...props,
    size: props.size ?? field?.size,
  })

  return (
    <textarea
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
