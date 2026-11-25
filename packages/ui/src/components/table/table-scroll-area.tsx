"use client"

import type { ComponentProps } from "react"
import { withTableContext } from "./table"

export interface TableScrollAreaProps extends ComponentProps<"div"> {}

export const TableScrollArea = withTableContext("div", "scrollArea")()
