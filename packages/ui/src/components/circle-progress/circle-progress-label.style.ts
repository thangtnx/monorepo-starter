import { defineComponentStyle } from "../../core/define"

export const circleProgressLabelStyle = defineComponentStyle({
  base: {
    fontSize: "var(--circle-label-size, {fontSizes.xs})",
    fontWeight: "medium",
    pointerEvents: "none",
  },
})
