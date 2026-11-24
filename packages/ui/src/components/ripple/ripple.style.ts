import { defineComponentStyle } from "../../core/define"

export const rippleStyle = defineComponentStyle({
  base: {
    "& > [data-part=wave]": {
      "&[data-state=released]": { opacity: 0 },
      animation:
        "ui-ripple-grow var(--ripple-duration, 420ms) {easings.standard}, ui-feedback-fade-in 90ms linear",
      backgroundImage:
        "radial-gradient(closest-side, currentColor 70%, transparent)",
      borderRadius: "full",
      height: "var(--ripple-size)",
      left: "var(--ripple-x)",
      opacity: "var(--ripple-opacity, 0.16)",
      pointerEvents: "none",
      position: "absolute",
      top: "var(--ripple-y)",
      transformOrigin: "center",
      transition: "opacity 320ms linear",
      width: "var(--ripple-size)",
      _motionReduce: { animation: "none", transitionDuration: "1ms" },
    },
    "--ripple-duration": "420ms",
    "--ripple-opacity": 0.16,
    "--ripple-size": "0px",
    "--ripple-x": "0px",
    "--ripple-y": "0px",
    borderRadius: "inherit",
    inset: "0",
    overflow: "hidden",
    pointerEvents: "none",
    position: "absolute",
  },
})
