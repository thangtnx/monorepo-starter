import { defineComponentSlotStyle } from "../../core/define"

export const cardStyle = defineComponentSlotStyle({
  base: {
    body: {
      alignItems: "flex-start",
      display: "flex",
      flex: "1",
      flexDirection: "column",
      gap: "var(--card-space, {spaces.4})",
      paddingBlock: "var(--card-inset-block, {spaces.3})",
      paddingInline: "var(--card-space, {spaces.4})",
    },
    footer: {
      alignItems: "center",
      display: "flex",
      gap: "var(--card-space, {spaces.4})",
      justifyContent: "start",
      paddingBlockEnd: "var(--card-inset-block, {spaces.3})",
      paddingInline: "var(--card-space, {spaces.4})",
    },
    header: {
      alignItems: "center",
      display: "flex",
      fontSize: "var(--card-header-font-size, {fontSizes.xl})",
      gap: "var(--card-space, {spaces.4})",
      justifyContent: "start",
      paddingBlockStart: "var(--card-inset-block, {spaces.3})",
      paddingInline: "var(--card-space, {spaces.4})",
    },
    root: {
      borderRadius: "lg",
      display: "flex",
      flexDirection: "column",
      overflowWrap: "break-word",
      width: "full",
    },
  },
  sizes: {
    sm: {
      root: {
        "--card-header-font-size": "{fontSizes.lg}",
        "--card-inset-block": "{spaces.2}",
        "--card-space": "{spaces.3}",
      },
    },
    md: {
      root: {
        "--card-header-font-size": "{fontSizes.xl}",
        "--card-inset-block": "{spaces.3}",
        "--card-space": "{spaces.4}",
      },
    },
    lg: {
      root: {
        "--card-header-font-size": "{fontSizes.2xl}",
        "--card-inset-block": "{spaces.5}",
        "--card-space": "{spaces.6}",
      },
    },
    xl: {
      root: {
        "--card-header-font-size": "{fontSizes.2xl}",
        "--card-inset-block": "{spaces.7}",
        "--card-space": "{spaces.8}",
      },
    },
  },
  variants: {
    elevated: {
      root: { background: "bg.panel", boxShadow: "md", color: "fg" },
    },
    outline: { root: { borderColor: "border", borderWidth: "1px" } },
    panel: {
      root: {
        background: "bg.panel",
        borderColor: "border",
        borderWidth: "1px",
        color: "fg",
      },
    },
    solid: {
      root: {
        "@scope (.ui-card) to (.ui-card)": {
          ":scope:is(&) :is(a, .ui-link)": { color: "inherit" },
        },
        background: "colorScheme.solid",
        color: "colorScheme.contrast",
      },
    },
    subtle: {
      root: { background: "colorScheme.subtle", color: "colorScheme.fg" },
    },
    surface: {
      root: {
        background: "colorScheme.subtle",
        borderColor: "colorScheme.muted",
        borderWidth: "1px",
        color: "colorScheme.fg",
      },
    },
  },
  defaultProps: {
    root: { colorScheme: "neutral", size: "md", variant: "panel" },
  },
})

export type CardStyle = typeof cardStyle
