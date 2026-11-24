import { defineComponentStyle } from "../../core/define"

export const radioGroupStyle = defineComponentStyle({
  base: {
    "& > legend": { textStyle: "label", marginBlockEnd: "2" },
    "& > legend > span": { color: "danger.fg" },
    display: "grid",
    minInlineSize: "0",
  },
  sizes: {
    sm: { fontSize: "sm", gap: "2" },
    md: { fontSize: "md", gap: "3" },
    lg: { fontSize: "lg", gap: "4" },
  },
  defaultProps: { size: "md" },
})
