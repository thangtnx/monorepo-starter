import { defineComponentStyle } from "../../core/define"

export const tooltipStyle = defineComponentStyle({
  base: {
    "&:popover-open, &[data-open=true]": {
      "@starting-style": { opacity: 0, transform: "scale(0.96)" },
      opacity: 1,
      transform: "scale(1)",
    },
    "--floating-x": "0px",
    "--floating-y": "0px",
    background: "bg.panel",
    borderColor: "border",
    borderRadius: "md",
    borderWidth: "1px",
    boxShadow: "0 2px 4px rgb(0 0 0 / 0.1), 0 0 1px rgb(0 0 0 / 0.28)",
    color: "fg",
    fontSize: "sm",
    left: "var(--floating-x)",
    lineHeight: "snug",
    margin: 0,
    maxInlineSize: "20rem",
    opacity: 0,
    padding: "1 2",
    pointerEvents: "none",
    position: "fixed",
    top: "var(--floating-y)",
    transform: "scale(0.96)",
    transition:
      "opacity {durations.fast} {easings.out}, transform {durations.fast} {easings.out}, display {durations.fast} allow-discrete, overlay {durations.fast} allow-discrete",
    _motionReduce: { transitionDuration: "1ms" },
  },
})

export type TooltipStyle = typeof tooltipStyle
