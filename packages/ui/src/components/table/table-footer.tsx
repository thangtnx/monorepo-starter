"use client"

import type { ComponentProps } from "react"
import { withTableContext } from "./table"

export interface TableFooterProps extends ComponentProps<"tfoot"> {}

export const TableFooter = withTableContext("tfoot", "footer")()
