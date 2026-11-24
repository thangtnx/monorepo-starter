import { defineComponentStyle } from "../../core/define"
import { inputStyle } from "../input/input.style"

export const textareaStyle = defineComponentStyle({
  base: {
    ...inputStyle.base,
    resize: "vertical",
    _invalid: { ...inputStyle.base._invalid, borderStyle: "dashed" },
  },

  sizes: {
    sm: { fontSize: "sm", minHeight: "16", padding: "2" },
    md: { fontSize: "md", minHeight: "20", padding: "3" },
    lg: { fontSize: "md", minHeight: "24", padding: "4" },
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

  defaultProps: { size: "md", variant: "outline" },
})
