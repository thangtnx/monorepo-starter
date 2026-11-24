import { defineComponentStyle } from "../../core/define"
import { stackStyle } from "../stack/stack.style"

const columns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const

export type GridColumnCount = (typeof columns)[number]

export const gridStyle = defineComponentStyle({
  base: { display: "grid" },
  props: {
    align: stackStyle.props.align,
    columns: Object.fromEntries(
      columns.map((count) => [
        count,
        {
          gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
        },
      ]),
    ),
    gap: stackStyle.props.gap,
    justify: {
      center: { justifyItems: "center" },
      end: { justifyItems: "end" },
      start: { justifyItems: "start" },
      stretch: { justifyItems: "stretch" },
    },
  },
  defaultProps: { columns: "1", gap: "4" },
})
