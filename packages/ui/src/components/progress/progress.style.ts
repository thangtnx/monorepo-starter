import { defineComponentStyle } from "../../core/define"

export const progressStyle = defineComponentStyle({
  base: {
    "& .ui-progress-fill[data-animate]": {
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
    "& .ui-progress-stripes[data-animate]": {
      animation:
        "ui-progress-stripes var(--progress-duration, 1s) linear infinite",
      _motionReduce: { animationName: "none" },
    },
    "& > *": { gridArea: "1 / 1" },
    "--progress-duration": "initial",
    display: "grid",
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
  variants: { outline: {}, subtle: {} },
  defaultProps: {
    colorScheme: "primary",
    size: "md",
    variant: "outline",
    animated: false,
    shape: "rounded",
    striped: false,
  },
})
