import { defineComponentStyle } from "../../core/define"

export const loadingStyle = defineComponentStyle({
  base: {
    "& .ui-loading-motion": {
      animation: "var(--loading-animation)",
      animationDelay: "var(--loading-delay)",
      animationDuration: "var(--loading-cycle, var(--loading-duration, 1s))",
      transform: "var(--loading-rest)",
      transformBox: "fill-box",
      transformOrigin: "var(--loading-origin)",
      _motionReduce: {
        animationName: "none",
        transform: "var(--loading-still, var(--loading-rest))",
      },
    },
    "& .ui-loading-oval-track": {
      stroke:
        "var(--loading-secondary, color-mix(in srgb, currentColor 50%, transparent))",
    },
    "&[data-scheme]": { color: "colorScheme.fg" },
    "--loading-animation": "none",
    "--loading-cycle": "initial",
    "--loading-delay": "0s",
    "--loading-duration": "initial",
    "--loading-end-stroke": "2px",
    "--loading-end-transform": "scale(20)",
    "--loading-flash-fill": 1,
    "--loading-mid-opacity": 1,
    "--loading-mid-transform": "none",
    "--loading-origin": "center",
    "--loading-rest": "none",
    "--loading-secondary": "initial",
    "--loading-still": "initial",
    display: "inline-block",
    flexShrink: 0,
    verticalAlign: "middle",
  },
})
