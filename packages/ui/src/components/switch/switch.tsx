"use client"

import type { ComponentProps } from "react"
import type { ComponentStyleProps } from "../../core/define"
import { ariaAttr } from "@monorepo/utils"
import { splitStyleProps } from "../../core/split-style-props"
import { useCheckableProps } from "../checkbox/checkbox-control"
import { switchStyle } from "./switch.style"

export interface SwitchProps
  extends
    Omit<ComponentProps<"input">, "children" | "color" | "size" | "type">,
    ComponentStyleProps<typeof switchStyle> {
  /** The switch id. When wrapped in a Field, set the id on Field. */
  id?: string
}

export function Switch(props: SwitchProps) {
  const [styleAttributes, rest] = splitStyleProps("switch", switchStyle, props)
  const input = useCheckableProps(rest)

  return (
    <input
      {...styleAttributes}
      {...input}
      type="checkbox"
      aria-readonly={ariaAttr(input.readOnly)}
      // oxlint-disable-next-line jsx-a11y/role-has-required-aria-props -- the native checkbox exposes its checked state
      role="switch"
    />
  )
}
