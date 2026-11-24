import { defineComponentStyle } from "../../core/define"

export const headingStyle = defineComponentStyle({
  variants: {
    display: { textStyle: "display" },
    h1: { textStyle: "h1" },
    h2: { textStyle: "h2" },
    h3: { textStyle: "h3" },
    h4: { textStyle: "h3", fontSize: "md" },
    h5: { textStyle: "h3", fontSize: "sm" },
    h6: { textStyle: "h3", fontSize: "xs" },
  },
})
