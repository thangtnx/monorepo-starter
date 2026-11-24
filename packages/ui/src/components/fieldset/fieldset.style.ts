import { defineComponentStyle } from "../../core/define"

export const fieldsetStyle = defineComponentStyle({
  base: {
    "& > [data-part=error]": { textStyle: "body.sm", color: "danger.fg" },
    "& > [data-part=hint]": { textStyle: "body.sm", color: "fg.muted" },
    "& > legend": { textStyle: "label", marginBlockEnd: "2" },
    "& > legend > [aria-hidden=true]": { color: "danger.fg" },
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
