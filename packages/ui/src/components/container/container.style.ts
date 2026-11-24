import { defineComponentStyle } from "../../core/define"

export const containerStyle = defineComponentStyle({
  base: { inlineSize: "full", marginInline: "auto", paddingInline: "4" },
  sizes: {
    sm: { maxInlineSize: "3xl" },
    md: { maxInlineSize: "5xl" },
    lg: { maxInlineSize: "7xl" },
    full: { maxInlineSize: "full" },
  },
  defaultProps: { size: "lg" },
})
