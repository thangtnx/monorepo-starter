"use client"

import type { ComponentProps } from "react"
import { withPopoverContext } from "./popover"

export const PopoverFooter = withPopoverContext("footer", "footer")()

export type PopoverFooterProps = ComponentProps<typeof PopoverFooter>
