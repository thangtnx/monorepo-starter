import { defineComponentStyle } from "../../core/define"

export const fieldStyle = defineComponentStyle({
  base: {
    "& [data-part=error]": { textStyle: "body.sm", color: "danger.fg" },
    "& [data-part=hint]": { textStyle: "body.sm", color: "fg.muted" },
    "& [data-part=label]": { textStyle: "label", color: "fg" },
    "& [data-part=required]": { color: "danger.fg" },
    display: "flex",
    flexDirection: "column",
    gap: "2",
    width: "full",
  },
})
