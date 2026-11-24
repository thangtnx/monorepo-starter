import { defineComponentStyle } from "../../core/define"
import { stackStyle } from "../stack/stack.style"

const columns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const

export type GridColumnCount = (typeof columns)[number]

export const gridStyle = defineComponentStyle({
  base: {
    "&[data-auto-columns]": { gridAutoColumns: "var(--grid-auto-columns)" },
    "&[data-auto-rows]": { gridAutoRows: "var(--grid-auto-rows)" },
    "&[data-template-areas]": {
      gridTemplateAreas: "var(--grid-template-areas)",
    },
    "&[data-template-columns]": {
      gridTemplateColumns: "var(--grid-template-columns)",
    },
    "&[data-template-rows]": { gridTemplateRows: "var(--grid-template-rows)" },
    "--grid-auto-columns": "auto",
    "--grid-auto-rows": "auto",
    "--grid-template-areas": "none",
    "--grid-template-columns": "none",
    "--grid-template-rows": "none",
    display: "grid",
  },
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
    flow: {
      column: { gridAutoFlow: "column" },
      "column-dense": { gridAutoFlow: "column dense" },
      dense: { gridAutoFlow: "dense" },
      row: { gridAutoFlow: "row" },
      "row-dense": { gridAutoFlow: "row dense" },
    },
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
