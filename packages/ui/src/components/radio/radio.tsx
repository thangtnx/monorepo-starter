"use client"

import type { ComponentProps } from "react"
import type { ComponentStyleProps } from "../../core/define"
import { dataAttr } from "@monorepo/utils"
import { use } from "react"
import { splitStyleProps } from "../../core/split-style-props"
import { useCheckableProps } from "../checkbox/checkbox-control"
import { useFieldContext } from "../field/field-context"
import { RadioGroupContext } from "./radio-group-context"
import { radioStyle } from "./radio.style"

export interface RadioProps
  extends
    Omit<ComponentProps<"input">, "children" | "color" | "size" | "type">,
    ComponentStyleProps<typeof radioStyle> {
  /** The radio id. When wrapped in a Field, set the id on Field. */
  id?: string
}

export function Radio({ size, ...props }: RadioProps) {
  const group = use(RadioGroupContext)
  const field = useFieldContext()
  const [styleAttributes, rest] = splitStyleProps("radio", radioStyle, {
    ...props,
    size: size ?? group?.size ?? field?.size,
  })
  const input = useCheckableProps(
    {
      ...rest,
      readOnly: group?.readOnly || rest.readOnly,
      required: group?.required || rest.required,
    },
    group,
  )

  return (
    <input
      {...styleAttributes}
      {...input}
      type="radio"
      name={group?.name ?? rest.name}
      data-readonly={dataAttr(input.readOnly)}
    />
  )
}
