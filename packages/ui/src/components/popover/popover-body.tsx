"use client"

import type { ComponentProps } from "react"
import { withPopoverContext } from "./popover"

export const PopoverBody = withPopoverContext("div", "body")()

export type PopoverBodyProps = ComponentProps<typeof PopoverBody>
