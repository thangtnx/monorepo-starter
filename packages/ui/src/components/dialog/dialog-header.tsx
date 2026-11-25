"use client"

import type { ComponentProps } from "react"
import { withDialogContext } from "./dialog"

export const DialogHeader = withDialogContext("header", "header")()

export type DialogHeaderProps = ComponentProps<typeof DialogHeader>
