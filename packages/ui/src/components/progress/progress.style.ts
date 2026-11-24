import { defineComponentStyle } from "../../core/define"

export const progressStyle = defineComponentStyle({
  base: {
    "& > svg": { display: "block" },
    "&[data-animated='true'][data-indeterminate='false'] .ui-progress-stripes":
      {
        animation:
          "ui-progress-stripes var(--progress-duration, 1s) linear infinite",
        _motionReduce: { animationName: "none" },
      },
    "&[data-indeterminate='true'] .ui-progress-fill": {
      animation:
        "ui-linear-progress var(--progress-duration, 1s) ease-in-out infinite",
      transform: "translateX(100%)",
      transformBox: "view-box",
      _motionReduce: {
        animationName: "none",
        opacity: 0.35,
        transform: "scaleX(4)",
      },
    },
    "@supports (animation-duration: attr(data-duration type(<time>)))": {
      "--progress-duration": "attr(data-duration type(<time>), 1s)",
    },
    overflow: "hidden",
  },
  props: {
    /** Animate the stripe pattern during determinate progress. @default false */
    animated: { true: {} },
    /** Shape of the bar's outer corners. @default "rounded" */
    shape: {
      circle: { borderRadius: "full" },
      rounded: { borderRadius: "sm" },
      square: {},
    },
    /** Display diagonal stripes on the range. @default false */
    striped: { true: {} },
  },
  sizes: {
    xs: { height: "1" },
    sm: { height: "2" },
    md: { height: "3" },
    lg: { height: "4" },
    xl: { height: "5" },
  },
  variants: {
    outline: {
      "--progress-range": "{colors.colorScheme.solid}",
      "--progress-track": "{colors.bg.emphasized}",
    },
    subtle: {
      "--progress-range": "{colors.colorScheme.outline}",
      "--progress-track": "{colors.colorScheme.subtle}",
    },
  },
  defaultProps: {
    colorScheme: "primary",
    size: "md",
    variant: "outline",
    animated: false,
    shape: "rounded",
    striped: false,
  },
})
