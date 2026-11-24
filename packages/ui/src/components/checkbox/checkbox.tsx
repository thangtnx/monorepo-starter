"use client"

import type { ComponentProps } from "react"
import type { ComponentStyleProps } from "../../core/define"
import { ariaAttr } from "@monorepo/utils"
import { splitStyleProps } from "../../core/split-style-props"
import { useCheckableProps } from "./checkbox-control"
import { checkboxStyle } from "./checkbox.style"

export interface CheckboxProps
  extends
    Omit<ComponentProps<"input">, "children" | "color" | "size" | "type">,
    ComponentStyleProps<typeof checkboxStyle> {
  /** The checkbox id. When wrapped in a Field, set the id on Field. */
  id?: string
}

export function Checkbox(props: CheckboxProps) {
  const [styleAttributes, rest] = splitStyleProps(
    "checkbox",
    checkboxStyle,
    props,
  )
  const input = useCheckableProps(rest)

  return (
    <input
      {...styleAttributes}
      {...input}
      type="checkbox"
      aria-readonly={ariaAttr(input.readOnly)}
    />
  )
}
