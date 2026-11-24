import { defineComponentStyle } from "../../core/define"

export const inputStyle = defineComponentStyle({
  base: {
    appearance: "none",
    background: "bg",
    borderColor: "border.emphasized",
    borderRadius: "md",
    borderWidth: "1px",
    color: "fg",
    minWidth: "0",
    transitionDuration: "fast",
    transitionProperty: "border-color, box-shadow",
    transitionTimingFunction: "standard",
    width: "full",
    _placeholder: { color: "fg.muted", opacity: 1 },
    _hover: { borderColor: "fg.muted" },
    _invalid: {
      borderColor: "danger.solid",
      boxShadow: "0 0 0 1px {colors.danger.solid}",
    },
    _readOnly: { background: "bg.muted" },
    _disabled: { layerStyle: "disabled" },
  },

  sizes: {
    sm: { fontSize: "sm", height: "8", paddingInline: "2" },
    md: { fontSize: "md", height: "10", paddingInline: "3" },
    // 44px: the minimum touch target on phones.
    lg: { fontSize: "md", height: "11", paddingInline: "4" },
  },

  variants: {
    filled: { background: "bg.muted", borderColor: "transparent" },
    flushed: {
      background: "transparent",
      borderColor: "transparent transparent {colors.border.emphasized}",
      borderRadius: "0",
      paddingInline: "0",
    },
    outline: {},
  },

  defaultProps: {
    size: "md",
    variant: "outline",
  },
})
