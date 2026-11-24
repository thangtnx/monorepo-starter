import { defineComponentStyle } from "../../core/define"

export const cardStyle = defineComponentStyle({
  base: {
    borderRadius: "lg",
    display: "flex",
    flexDirection: "column",
    overflowWrap: "break-word",
  },
  sizes: {
    sm: {
      "--card-header-font-size": "{fontSizes.lg}",
      "--card-inset-block": "{spaces.2}",
      "--card-space": "{spaces.3}",
    },
    md: {
      "--card-header-font-size": "{fontSizes.xl}",
      "--card-inset-block": "{spaces.3}",
      "--card-space": "{spaces.4}",
    },
    lg: {
      "--card-header-font-size": "{fontSizes.2xl}",
      "--card-inset-block": "{spaces.5}",
      "--card-space": "{spaces.6}",
    },
  },
  variants: {
    elevated: { background: "bg.panel", boxShadow: "md" },
    outline: { borderColor: "border", borderWidth: "1px" },
    panel: {
      background: "bg.panel",
      borderColor: "border",
      borderWidth: "1px",
    },
    solid: {
      "& .ui-link": { color: "inherit" },
      background: "colorScheme.solid",
      color: "colorScheme.contrast",
    },
    subtle: { background: "colorScheme.subtle", color: "colorScheme.fg" },
    surface: {
      background: "colorScheme.subtle",
      borderColor: "colorScheme.muted",
      borderWidth: "1px",
      color: "colorScheme.fg",
    },
  },
  defaultProps: { colorScheme: "neutral", size: "md", variant: "panel" },
})
