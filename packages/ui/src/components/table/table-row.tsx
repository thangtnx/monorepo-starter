"use client"

import type { ComponentProps } from "react"
import { withTableContext } from "./table"

export interface TableRowProps extends ComponentProps<"tr"> {}

export const TableRow = withTableContext("tr", "row")()
