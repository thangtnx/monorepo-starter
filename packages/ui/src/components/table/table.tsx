"use client"

import type { ComponentProps } from "react"
import type { ThemeProps } from "../../core/define"
import type { TableStyle } from "./table.style"
import { createSlotComponent } from "../../core/create-component"
import { tableStyle } from "./table.style"

/**
 * Root table element providing shared table variants, sizing, and slot styles.
 *
 * @property colorScheme Defaults to `"neutral"`.
 * @property highlightOnHover Defaults to `false`.
 * @property size Defaults to `"md"`.
 * @property stickyHeader Defaults to `false`.
 * @property striped Defaults to `false`.
 * @property variant Defaults to `"line"`.
 * @property withBorder Defaults to `false`.
 * @property withColumnBorders Defaults to `false`.
 */
export interface TableRootProps
  extends Omit<ComponentProps<"table">, "color">, ThemeProps<TableStyle> {}

const {
  PropsContext: TablePropsContext,
  usePropsContext: useTablePropsContext,
  withContext,
  withProvider,
} = createSlotComponent<TableRootProps, TableStyle>("table", tableStyle)

const TableRoot = withProvider("table", "root")()

export {
  TablePropsContext,
  TableRoot,
  useTablePropsContext,
  withContext as withTableContext,
}
