"use client"

import type { ComponentProps } from "react"
import { withMenuContext } from "./menu"

export const MenuGroup = withMenuContext("div", "group")({ role: "group" })
export const MenuLabel = withMenuContext("div", "label")()
export const MenuSeparator = withMenuContext("hr", "separator")()
export const MenuCommand = withMenuContext("span", "command")()

export type MenuGroupProps = ComponentProps<typeof MenuGroup>
export type MenuLabelProps = ComponentProps<typeof MenuLabel>
export type MenuSeparatorProps = ComponentProps<typeof MenuSeparator>
export type MenuCommandProps = ComponentProps<typeof MenuCommand>
