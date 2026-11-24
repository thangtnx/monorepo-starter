import { defineComponentStyle } from "../../core/define"

export const badgeStyle = defineComponentStyle({
  base: {
    alignItems: "center",
    borderColor: "transparent",
    borderRadius: "sm",
    borderWidth: "1px",
    display: "inline-flex",
    fontWeight: "medium",
    gap: "1",
    lineHeight: "shorter",
    whiteSpace: "nowrap",
    _icon: { flexShrink: 0, height: "1em", width: "1em" },
  },

  variants: {
    outline: { borderColor: "colorScheme.outline", color: "colorScheme.fg" },
    solid: {
      background: "colorScheme.solid",
      color: "colorScheme.contrast",
    },
    subtle: { background: "colorScheme.subtle", color: "colorScheme.fg" },
    surface: {
      background: "colorScheme.subtle",
      borderColor: "colorScheme.muted",
      color: "colorScheme.fg",
    },
  },

  sizes: {
    sm: { fontSize: "xs", minHeight: "5", paddingInline: "2" },
    md: { fontSize: "sm", minHeight: "6", paddingInline: "2" },
    lg: { fontSize: "md", minHeight: "7", paddingInline: "3" },
  },

  defaultProps: {
    colorScheme: "neutral",
    size: "md",
    variant: "subtle",
  },
})
