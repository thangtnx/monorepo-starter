import { defineComponentStyle } from "../../core/define"
import { checkableIndicatorVariants } from "../checkbox/checkable-appearance"

export const radioStyle = defineComponentStyle({
  base: {
    "& > input:checked + span::before": {
      aspectRatio: 1,
      backgroundColor: "currentColor",
      borderRadius: "var(--radio-dot-radius)",
      content: '""',
      width: "var(--radio-dot-size)",
    },
    "--radio-dot-radius": 0,
    "--radio-dot-size": "{sizes.2}",
  },
  props: {
    shape: {
      circle: {},
      rounded: {},
      square: {},
    },
  },
  sizes: {
    sm: {},
    md: {},
    lg: {},
  },
  variants: {
    ...checkableIndicatorVariants,
    base: {},
  },
  defaultProps: { size: "md", variant: "solid", shape: "circle" },
})
