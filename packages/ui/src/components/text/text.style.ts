import { defineComponentStyle } from "../../core/define"

export const textStyle = defineComponentStyle({
  variants: {
    body: { textStyle: "body" },
    "body.lg": { textStyle: "body.lg" },
    "body.sm": { textStyle: "body.sm" },
    caption: { textStyle: "caption" },
    label: { textStyle: "label" },
  },
  defaultProps: { variant: "body" },
})
