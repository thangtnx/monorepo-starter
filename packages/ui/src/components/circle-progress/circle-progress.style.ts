import { defineComponentStyle } from "../../core/define"

export const circleProgressStyle = defineComponentStyle({
  base: {
    "& > *": { gridArea: "1 / 1" },
    "&[data-indeterminate='true'] .ui-circle-progress-range": {
      animation:
        "ui-feedback-spin var(--circle-duration, 1.5s) linear infinite",
      transformBox: "view-box",
      transformOrigin: "center",
      _motionReduce: { animationName: "none", strokeDasharray: "3 4" },
    },
    "@supports (animation-duration: attr(data-duration type(<time>)))": {
      "--circle-duration": "attr(data-duration type(<time>), 1.5s)",
    },
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
  variants: {
    outline: {
      "--circle-range": "{colors.colorScheme.solid}",
      "--circle-track": "{colors.bg.emphasized}",
    },
    subtle: {
      "--circle-range": "{colors.colorScheme.outline}",
      "--circle-track": "{colors.colorScheme.subtle}",
    },
  },
  defaultProps: {
    colorScheme: "primary",
    size: "md",
    variant: "outline",
    shape: "rounded",
  },
})
