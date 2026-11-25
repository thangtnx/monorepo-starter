"use client"

import type { ComponentProps } from "react"
import { withPopoverContext } from "./popover"

export const PopoverHeader = withPopoverContext("header", "header")()

export type PopoverHeaderProps = ComponentProps<typeof PopoverHeader>
