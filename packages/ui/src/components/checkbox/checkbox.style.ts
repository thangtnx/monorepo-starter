import { defineComponentStyle } from "../../core/define"
import { checkableIndicatorVariants } from "./checkable-appearance"

export const checkboxStyle = defineComponentStyle({
  base: {
    "& > input + span": {
      fontSize: "var(--check-icon-size)",
      lineHeight: 1,
      overflow: "hidden",
    },
    "& > input + span > span": {
      alignItems: "center",
      display: "inline-flex",
      justifyContent: "center",
      lineHeight: 1,
      maxHeight: "100%",
      maxWidth: "100%",
    },
    "& > input + span svg": {
      height: "1em",
      width: "1em",
    },
    "& input:is(:not(:checked),:indeterminate)+span>:first-child, & input:not(:indeterminate)+span>:last-child":
      {
        display: "none",
      },
    "--check-icon-size": "{fontSizes.xs}",
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
