import { defineComponentStyle } from "../../core/define"

export const checkboxStyle = defineComponentStyle({
  base: {
    "&[aria-invalid=true]:focus-visible": {
      boxShadow: "0 0 0 5px {colors.focusRing}",
    },
    accentColor: "var(--color-scheme-solid, {colors.primary.solid})",
    cursor: "pointer",
    flexShrink: 0,
    verticalAlign: "middle",
    _invalid: {
      outline: "1px dashed {colors.danger.solid}",
      outlineOffset: "2px",
    },
    _readOnly: { cursor: "default" },
    _disabled: { layerStyle: "disabled" },
  },

  sizes: {
    sm: { height: "4", width: "4" },
    md: { height: "5", width: "5" },
    lg: { height: "6", width: "6" },
  },

  defaultProps: { size: "md" },
})
