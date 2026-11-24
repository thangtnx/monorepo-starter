import { defineComponentStyle } from "../../core/define"

export const alertStyle = defineComponentStyle({
  base: {
    "& > :is(.ui-alert-icon, .ui-alert-loading)": {
      color: "var(--alert-accent, currentColor)",
    },
    alignItems: "start",
    border: "1px solid transparent",
    borderRadius: "md",
    display: "flex",
    flexWrap: "wrap",
    gap: "2",
    padding: "4",
    position: "relative",
  },
  variants: {
    island: {
      "--alert-accent": "{colors.colorScheme.fg}",
      background: "bg.panel",
      borderColor: "border",
      borderInlineStart: "4px solid {colors.colorScheme.outline}",
      boxShadow: "sm",
    },
    plain: {
      "--alert-accent": "{colors.colorScheme.fg}",
      background: "bg.panel",
      borderColor: "border",
    },
    solid: {
      background: "colorScheme.emphasized",
      color: "colorScheme.contrast",
    },
    subtle: {
      "--alert-accent": "{colors.colorScheme.fg}",
      background: "colorScheme.subtle",
      color: "colorScheme.fg",
    },
    surface: {
      "--alert-accent": "{colors.colorScheme.fg}",
      background: "colorScheme.subtle",
      borderColor: "colorScheme.outline",
      color: "colorScheme.fg",
    },
  },
  defaultProps: { variant: "plain" },
})
