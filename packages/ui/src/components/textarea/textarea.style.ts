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

  defaultProps: { size: "md" },
})
