import { defineComponentStyle } from "../../core/define"

export const buttonStyle = defineComponentStyle({
  base: {
    "& .ui-button-icon": {
      alignItems: "center",
      display: "inline-flex",
      justifyContent: "center",
    },
    "& .ui-button-icon svg": { flexShrink: 0, height: "1em", width: "1em" },
    "& > .ui-button-loading-indicator": {
      alignItems: "center",
      display: "inline-flex",
      justifyContent: "center",
    },
    "& > .ui-button-loading-indicator > .ui-loading-icon-spinner": {
      flexShrink: 0,
      height: "1em",
      width: "1em",
    },
    "& > .ui-button-loading-label": { display: "contents" },
    "&[data-loading-overlay] > .ui-button-loading-indicator": {
      left: "50%",
      position: "absolute",
      translate: "-50% 0",
    },
    "&[data-loading-overlay] > .ui-button-loading-label": {
      alignItems: "center",
      display: "inline-flex",
      gap: "inherit",
      opacity: 0,
    },
    alignItems: "center",
    appearance: "none",
    borderColor: "transparent",
    borderRadius: "md",
    borderWidth: "1px",
    cursor: "pointer",
    display: "inline-flex",
    fontWeight: "medium",
    gap: "2",
    justifyContent: "center",
    position: "relative",
    transitionDuration: "fast",
    transitionProperty: "background-color, border-color, color, box-shadow",
    transitionTimingFunction: "standard",
    userSelect: "none",
    whiteSpace: "nowrap",
    _disabled: { layerStyle: "disabled" },
  },

  props: {
    /**
     * If `true`, the button fills the width of its container.
     *
     * @default false
     */
    fullWidth: {
      true: { width: "full" },
    },
  },

  variants: {
    ghost: { layerStyle: "ghost" },
    outline: { layerStyle: "outline" },
    solid: { layerStyle: "solid" },
    subtle: { layerStyle: "subtle" },
    surface: { layerStyle: "surface" },
  },

  sizes: {
    xs: { fontSize: "xs", height: "8", minWidth: "8", paddingInline: "2" },
    sm: { fontSize: "sm", height: "9", minWidth: "9", paddingInline: "3" },
    md: { fontSize: "md", height: "10", minWidth: "10", paddingInline: "4" },
    // 44px: the minimum touch target on phones.
    lg: { fontSize: "lg", height: "11", minWidth: "11", paddingInline: "5" },
    xl: { fontSize: "xl", height: "12", minWidth: "12", paddingInline: "6" },
  },

  defaultProps: {
    colorScheme: "primary",
    size: "md",
    variant: "solid",
  },
})
