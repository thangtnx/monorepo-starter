import { defineComponentStyle } from "../../core/define"
import { inputStyle } from "../input/input.style"

export const selectStyle = defineComponentStyle({
  ...inputStyle,
  base: {
    ...inputStyle.base,
    "&:is([multiple], [size]:not([size='1'], [size='0']))": {
      height: "auto",
      paddingBlock: "2",
    },
    appearance: "auto",
    _invalid: { ...inputStyle.base._invalid, borderStyle: "dashed" },
  },
  sizes: {
    ...inputStyle.sizes,
    lg: { ...inputStyle.sizes.lg, minHeight: "11" },
  },
})
