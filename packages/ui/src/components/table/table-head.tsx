"use client"

import type { ComponentProps } from "react"
import { withTableContext } from "./table"

export interface TableHeadProps extends ComponentProps<"th"> {
  /**
   * Aligns numeric header content to the end with tabular numerals.
   *
   * @default false
   */
  numeric?: boolean
}

const TableHeadElement = withTableContext("th", "head")()

export function TableHead({ numeric = false, ...props }: TableHeadProps) {
  return (
    <TableHeadElement data-numeric={numeric ? "true" : undefined} {...props} />
  )
}
