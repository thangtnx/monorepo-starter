import type { ComponentProps } from "react"
import type { ComponentStyleProps } from "../../core/define"
import type { GridColumnCount } from "./grid.style"
import { splitStyleProps } from "../../core/split-style-props"
import { gridStyle } from "./grid.style"

export interface GridProps
  extends
    Omit<ComponentProps<"div">, "color">,
    Omit<ComponentStyleProps<typeof gridStyle>, "columns"> {
  /** How items align along the block axis within their grid areas. */
  align?: keyof typeof gridStyle.props.align
  /** Implicitly created column track size (`grid-auto-columns`). */
  autoColumns?: string
  /** Implicitly created row track size (`grid-auto-rows`). */
  autoRows?: string
  /**
   * The number of equal-width columns.
   *
   * @default 1
   */
  columns?: GridColumnCount
  /** Controls how auto-placed items flow into the grid (`grid-auto-flow`). */
  flow?: keyof typeof gridStyle.props.flow
  /**
   * The space token between tracks, or `"0"` for no gap.
   *
   * @default "4"
   */
  gap?: keyof typeof gridStyle.props.gap
  /** How items align along the inline axis within their grid areas. */
  justify?: keyof typeof gridStyle.props.justify
  /** Responsive minimum child width for `repeat(auto-fit, minmax(..., 1fr))`. */
  minChildWidth?: string
  /** Named grid template areas (`grid-template-areas`). */
  templateAreas?: string
  /** Custom column track definition (`grid-template-columns`). */
  templateColumns?: string
  /** Custom row track definition (`grid-template-rows`). */
  templateRows?: string
}

export function Grid({
  style,
  autoColumns,
  autoRows,
  columns,
  minChildWidth,
  templateAreas,
  templateColumns,
  templateRows,
  ...props
}: GridProps) {
  const resolvedColumns =
    templateColumns ??
    (minChildWidth
      ? `repeat(auto-fit, minmax(min(${minChildWidth}, 100%), 1fr))`
      : undefined)

  const [styleAttributes, rest] = splitStyleProps("grid", gridStyle, {
    ...props,
    columns: columns?.toString(),
  })

  if (resolvedColumns !== undefined && columns === undefined)
    delete styleAttributes["data-columns"]

  const vars: { [key: `--${string}`]: string } = {}
  const dataAttributes: { [key: `data-${string}`]: string } = {}

  if (resolvedColumns !== undefined) {
    dataAttributes["data-template-columns"] = ""
    vars["--grid-template-columns"] = resolvedColumns
  }
  if (templateRows !== undefined) {
    dataAttributes["data-template-rows"] = ""
    vars["--grid-template-rows"] = templateRows
  }
  if (templateAreas !== undefined) {
    dataAttributes["data-template-areas"] = ""
    vars["--grid-template-areas"] = templateAreas
  }
  if (autoColumns !== undefined) {
    dataAttributes["data-auto-columns"] = ""
    vars["--grid-auto-columns"] = autoColumns
  }
  if (autoRows !== undefined) {
    dataAttributes["data-auto-rows"] = ""
    vars["--grid-auto-rows"] = autoRows
  }

  const hasVars = Object.keys(vars).length > 0

  return (
    <div
      {...styleAttributes}
      {...dataAttributes}
      {...rest}
      style={hasVars || style ? { ...vars, ...style } : undefined}
    />
  )
}
