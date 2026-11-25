"use client"

import type { ComponentProps } from "react"
import { withTableContext } from "./table"

export interface TableCellProps extends ComponentProps<"td"> {
  /**
   * Aligns numeric cell content to the end with tabular numerals.
   *
   * @default false
   */
  numeric?: boolean
}

const TableCellElement = withTableContext("td", "cell")()

export function TableCell({ numeric = false, ...props }: TableCellProps) {
  return (
    <TableCellElement data-numeric={numeric ? "true" : undefined} {...props} />
  )
}
