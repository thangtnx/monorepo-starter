"use client"

import type { ComponentProps } from "react"
import { withDialogContext } from "./dialog"

export const DialogFooter = withDialogContext("footer", "footer")()

export type DialogFooterProps = ComponentProps<typeof DialogFooter>
