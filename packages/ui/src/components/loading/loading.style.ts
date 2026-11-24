import { defineComponentStyle } from "../../core/define"

export const loadingStyle = defineComponentStyle({
  base: {
    "&:not([height])": { height: "1em" },
    "&:not([width])": { width: "1em" },
    "& [data-motion='beat']:nth-child(3n)": { animationDelay: "-300ms" },
    "& [data-motion='beat']:nth-child(3n + 2)": { animationDelay: "-150ms" },
    "& [data-motion='puff']": { "--loading-motion": "ui-loading-puff" },
    "& [data-motion='spin']": {
      "--loading-direction": "normal",
      "--loading-easing": "linear",
      "--loading-motion": "ui-feedback-spin",
    },
    "& [data-motion]": {
      animation:
        "var(--loading-motion, ui-loading-beat) var(--loading-duration, 1s) var(--loading-easing, ease) infinite var(--loading-direction, alternate)",
      transformBox: "fill-box",
      transformOrigin: "center",
      _motionReduce: { animationName: "none" },
    },
    "&[data-scheme]": { color: "colorScheme.fg" },
    "@supports (animation-duration: attr(data-duration type(<time>)))": {
      "--loading-duration": "attr(data-duration type(<time>), 1s)",
    },
    display: "inline-block",
    flexShrink: 0,
    verticalAlign: "middle",
  },
})
