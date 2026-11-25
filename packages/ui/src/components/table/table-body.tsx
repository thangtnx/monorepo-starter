"use client"

import type { ComponentProps } from "react"
import { withTableContext } from "./table"

export interface TableBodyProps extends ComponentProps<"tbody"> {}

export const TableBody = withTableContext("tbody", "body")()
