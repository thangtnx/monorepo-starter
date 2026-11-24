import { defineComponentStyle } from "../../core/define"
import { inputStyle } from "../input/input.style"

export const selectStyle = defineComponentStyle({
  base: {
    ...inputStyle.base,
    "&[aria-expanded=true]": { borderColor: "focusRing" },
    "&[aria-expanded=true] [data-part=chevron]": {
      transform: "rotate(180deg)",
    },
    "& [data-part=chevron]": {
      blockSize: "4",
      flexShrink: 0,
      inlineSize: "4",
      transitionDuration: "fast",
      transitionProperty: "transform",
      transitionTimingFunction: "standard",
      _motionReduce: { transitionProperty: "none" },
    },
    "& [data-part=value]": {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    "& [data-placeholder]": { color: "fg.muted" },
    alignItems: "center",
    cursor: "pointer",
    display: "flex",
    gap: "2",
    justifyContent: "space-between",
    textAlign: "start",
    _motionReduce: { transitionProperty: "none" },
    _invalid: { ...inputStyle.base._invalid, borderStyle: "dashed" },
    _readOnly: { ...inputStyle.base._readOnly, cursor: "default" },
    _disabled: { ...inputStyle.base._disabled, cursor: "not-allowed" },
  },
  sizes: {
    ...inputStyle.sizes,
    lg: { ...inputStyle.sizes.lg, minHeight: "11" },
  },
  variants: {
    filled: { background: "bg.muted", borderColor: "transparent" },
    flushed: {
      background: "transparent",
      borderColor: "transparent transparent {colors.border.emphasized}",
      borderRadius: "0",
    },
    outline: {},
  },
  defaultProps: { size: "md", variant: "outline" },
})
