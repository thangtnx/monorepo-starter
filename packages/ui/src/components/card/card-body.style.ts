import { defineComponentStyle } from "../../core/define"

export const cardBodyStyle = defineComponentStyle({
  base: {
    display: "flex",
    flex: "1",
    flexDirection: "column",
    gap: "var(--card-space, {spaces.4})",
    paddingBlock: "var(--card-inset-block, {spaces.3})",
    paddingInline: "var(--card-space, {spaces.4})",
  },
})
