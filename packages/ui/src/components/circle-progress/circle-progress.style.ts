import { defineComponentStyle } from "../../core/define"

export const circleProgressStyle = defineComponentStyle({
  base: {
    "& .ui-circle-progress-range[data-spin]": {
      animation:
        "ui-feedback-spin var(--circle-duration, 1.5s) linear infinite",
      transformBox: "view-box",
      transformOrigin: "center",
      _motionReduce: { animationName: "none", strokeDasharray: "3 4" },
    },
    "& > *": { gridArea: "1 / 1" },
    "--circle-duration": "initial",
    display: "inline-grid",
    placeItems: "center",
    verticalAlign: "middle",
  },
  props: {
    /** Shape of the range's endpoints. @default "rounded" */
    shape: { rounded: {}, square: {} },
  },
  sizes: {
    xs: {},
    sm: {},
    md: {},
    lg: {},
    xl: { "--circle-label-size": "{fontSizes.sm}" },
  },
  variants: { outline: {}, subtle: {} },
  defaultProps: {
    colorScheme: "primary",
    size: "md",
    variant: "outline",
    shape: "rounded",
  },
})
