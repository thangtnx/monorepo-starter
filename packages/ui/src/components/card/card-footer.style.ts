import { defineComponentStyle } from "../../core/define"

export const cardFooterStyle = defineComponentStyle({
  base: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: "var(--card-space, {spaces.4})",
    justifyContent: "start",
    paddingBlockEnd: "var(--card-inset-block, {spaces.3})",
    paddingInline: "var(--card-space, {spaces.4})",
  },
})
