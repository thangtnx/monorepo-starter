import { defineComponentStyle } from "../../core/define"

export const checkableGroupStyle = defineComponentStyle({
  base: {
    "& > legend": { textStyle: "label", marginBlockEnd: "2" },
    "& > legend > [aria-hidden=true]": { color: "danger.fg" },
    display: "flex",
    flexDirection: "column",
    gap: "2",
    minInlineSize: "0",
  },
  props: {
    orientation: {
      horizontal: { flexDirection: "row", flexWrap: "wrap" },
      vertical: {},
    },
  },
})
