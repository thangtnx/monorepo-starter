"use client"

import type { ComponentProps } from "react"
import { withTableContext } from "./table"

export interface TableHeaderProps extends ComponentProps<"thead"> {}

export const TableHeader = withTableContext("thead", "header")()
