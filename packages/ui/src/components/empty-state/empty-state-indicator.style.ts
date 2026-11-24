import { defineComponentStyle } from "../../core/define"

export const emptyStateIndicatorStyle = defineComponentStyle({
  base: {
    color: "fg.muted",
    display: "grid",
    fontSize: "var(--empty-indicator-size)",
    minHeight: "var(--empty-indicator-size)",
    placeItems: "center",
  },
})
