"use client"

import type { ComponentProps } from "react"
import { withTableContext } from "./table"

export interface TableCaptionProps extends ComponentProps<"caption"> {}

export const TableCaption = withTableContext("caption", "caption")()
