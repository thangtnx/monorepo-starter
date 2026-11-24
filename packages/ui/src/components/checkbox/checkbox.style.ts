import { defineComponentStyle } from "../../core/define"
import { checkableIndicatorVariants } from "./checkable-appearance"

export const checkboxStyle = defineComponentStyle({
  base: {
    "& > input + span": { fontSize: "var(--check-icon-size)" },
    "& input:is(:not(:checked),:indeterminate)+span>:first-child, & input:not(:indeterminate)+span>:last-child":
      {
        display: "none",
      },
    "--check-icon-size": "{fontSizes.sm}",
  },
  props: {
    shape: {
      rounded: {},
      square: {},
    },
  },
  sizes: {
    sm: {},
    md: {},
    lg: {},
  },
  variants: checkableIndicatorVariants,
  defaultProps: { size: "md", variant: "solid", shape: "rounded" },
})
