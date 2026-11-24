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
  },

  variants: {
    outline: { borderColor: "colorScheme.outline", color: "colorScheme.fg" },
    solid: {
      background: "colorScheme.solid",
      color: "colorScheme.contrast",
    },
    subtle: { background: "colorScheme.subtle", color: "colorScheme.fg" },
  },

  sizes: {
    sm: { fontSize: "xs", paddingInline: "1" },
    md: { fontSize: "sm", paddingInline: "2" },
    lg: { fontSize: "md", paddingBlock: "1", paddingInline: "3" },
  },

  defaultProps: {
    colorScheme: "neutral",
    size: "md",
    variant: "subtle",
  },
})
