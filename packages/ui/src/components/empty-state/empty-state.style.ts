import { defineComponentStyle } from "../../core/define"

export const emptyStateStyle = defineComponentStyle({
  base: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
  },
  sizes: {
    sm: {
      "--empty-indicator-size": "{sizes.8}",
      "--empty-title-size": "{fontSizes.md}",
      gap: "3",
      padding: "4",
    },
    md: {
      "--empty-indicator-size": "{sizes.10}",
      "--empty-title-size": "{fontSizes.lg}",
      gap: "4",
      padding: "6",
    },
    lg: {
      "--empty-indicator-size": "{sizes.12}",
      "--empty-title-size": "{fontSizes.xl}",
      gap: "5",
      padding: "8",
    },
  },
  defaultProps: { size: "md" },
})
