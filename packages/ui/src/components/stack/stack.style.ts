import { defineComponentStyle } from "../../core/define"

export const stackStyle = defineComponentStyle({
  base: { display: "flex" },
  props: {
    align: {
      center: { alignItems: "center" },
      end: { alignItems: "end" },
      start: { alignItems: "start" },
      stretch: { alignItems: "stretch" },
    },
    direction: {
      column: { flexDirection: "column" },
      row: { flexDirection: "row" },
    },
    gap: {
      "0": { gap: 0 },
      "1": { gap: "1" },
      "2": { gap: "2" },
      "3": { gap: "3" },
      "4": { gap: "4" },
      "6": { gap: "6" },
      "8": { gap: "8" },
      "12": { gap: "12" },
    },
    justify: {
      center: { justifyContent: "center" },
      end: { justifyContent: "end" },
      "space-between": { justifyContent: "space-between" },
      start: { justifyContent: "start" },
    },
  },
  defaultProps: { direction: "column", gap: "4" },
})
