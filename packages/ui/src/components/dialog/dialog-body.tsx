"use client"

import type { ComponentProps } from "react"
import { withDialogContext } from "./dialog"

export const DialogBody = withDialogContext("div", "body")()

export type DialogBodyProps = ComponentProps<typeof DialogBody>
