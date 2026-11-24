import { defineComponentStyle } from "../../core/define"

export const buttonStyle = defineComponentStyle({
  base: {
    "& > .ui-button-loading-label": { opacity: 0 },
    "&[data-loading-overlay] > .ui-button-loading-indicator": {
      left: "50%",
      position: "absolute",
      translate: "-50% 0",
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
    _icon: { flexShrink: 0, height: "1em", width: "1em" },
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
  },

  sizes: {
    sm: { fontSize: "sm", height: "8", minWidth: "8", paddingInline: "3" },
    md: { fontSize: "md", height: "10", minWidth: "10", paddingInline: "4" },
    // 44px: the minimum touch target on phones.
    lg: { fontSize: "md", height: "11", minWidth: "11", paddingInline: "5" },
    xl: { fontSize: "lg", height: "12", minWidth: "12", paddingInline: "6" },
  },

  defaultProps: {
    colorScheme: "primary",
    size: "md",
    variant: "solid",
  },
})
