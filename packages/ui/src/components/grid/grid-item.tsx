import type { ComponentProps } from "react"
import type { ComponentStyleProps } from "../../core/define"
import { splitStyleProps } from "../../core/split-style-props"
import { gridItemStyle } from "./grid-item.style"

export interface GridItemProps
  extends
    Omit<ComponentProps<"div">, "color">,
    ComponentStyleProps<typeof gridItemStyle> {
  /** Named grid area (`grid-area`). */
  area?: string
  /** Ending column grid line (`grid-column-end`). */
  colEnd?: number
  /** Number of columns to span, or `"full"` for `1 / -1`. */
  colSpan?: "full" | number
  /** Starting column grid line (`grid-column-start`). */
  colStart?: number
  /** Ending row grid line (`grid-row-end`). */
  rowEnd?: number
  /** Number of rows to span, or `"full"` for `1 / -1`. */
  rowSpan?: "full" | number
  /** Starting row grid line (`grid-row-start`). */
  rowStart?: number
}

function trackPlacement(
  span?: "full" | number,
  start?: number,
  end?: number,
): string | undefined {
  if (span === "full") return "1 / -1"
  if (start !== undefined && end !== undefined) return `${start} / ${end}`
  if (start !== undefined && span !== undefined)
    return `${start} / span ${span}`
  if (span !== undefined && end !== undefined) return `span ${span} / ${end}`
  if (start !== undefined) return `${start}`
  if (end !== undefined) return `auto / ${end}`
  if (span !== undefined) return `span ${span}`
  return undefined
}

export function GridItem({
  style,
  area,
  colEnd,
  colSpan,
  colStart,
  rowEnd,
  rowSpan,
  rowStart,
  ...props
}: GridItemProps) {
  const [styleAttributes, rest] = splitStyleProps(
    "grid-item",
    gridItemStyle,
    props,
  )
  const column = trackPlacement(colSpan, colStart, colEnd)
  const row = trackPlacement(rowSpan, rowStart, rowEnd)
  const vars: { [key: `--${string}`]: string } = {}
  const dataAttributes: { [key: `data-${string}`]: string } = {}

  if (area !== undefined) {
    dataAttributes["data-area"] = ""
    vars["--grid-area"] = area
  }
  if (column !== undefined) {
    dataAttributes["data-column"] = ""
    vars["--grid-column"] = column
  }
  if (row !== undefined) {
    dataAttributes["data-row"] = ""
    vars["--grid-row"] = row
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
