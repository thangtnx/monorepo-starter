import { defineComponentStyle } from "../../core/define"

export const cardHeaderStyle = defineComponentStyle({
  base: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    fontSize: "var(--card-header-font-size, {fontSizes.xl})",
    gap: "var(--card-space, {spaces.4})",
    justifyContent: "start",
    paddingBlockStart: "var(--card-inset-block, {spaces.3})",
    paddingInline: "var(--card-space, {spaces.4})",
  },
})
