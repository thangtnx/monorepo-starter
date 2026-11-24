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
  /**
   * The number of equal-width columns.
   *
   * @default 1
   */
  columns?: GridColumnCount
  /**
   * The space token between tracks, or `"0"` for no gap.
   *
   * @default "4"
   */
  gap?: keyof typeof gridStyle.props.gap
  /** How items align along the inline axis within their grid areas. */
  justify?: keyof typeof gridStyle.props.justify
}

export function Grid({ columns, ...props }: GridProps) {
  const [styleAttributes, rest] = splitStyleProps("grid", gridStyle, {
    ...props,
    columns: columns?.toString(),
  })

  return <div {...styleAttributes} {...rest} />
}
