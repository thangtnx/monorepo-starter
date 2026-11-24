import { defineComponentStyle } from "../../core/define"

export const motionStyle = defineComponentStyle({
  base: {
    "&[data-state=closed]": {
      transitionDelay: "var(--motion-exit-delay)",
      transitionDuration: "var(--motion-exit-duration)",
      transitionTimingFunction: "{easings.in}",
    },
    "&[data-state=open]": {
      transitionDelay: "var(--motion-enter-delay)",
      transitionDuration: "var(--motion-enter-duration)",
      transitionTimingFunction: "{easings.out}",
    },
    "--motion-enter-delay": "0ms",
    "--motion-enter-duration": "{durations.moderate}",
    "--motion-exit-delay": "0ms",
    "--motion-exit-duration": "{durations.fast}",
    "--motion-scale": 0.95,
    "--motion-start-height": "0px",
    "--motion-x": "0px",
    "--motion-y": "8px",
    _motionReduce: {
      "&[data-state]": { transitionDelay: "0ms", transitionDuration: "1ms" },
    },
  },
  props: {
    placement: {
      bottom: {
        "--motion-slide-offset": "translateY(100%)",
        bottom: 0,
        insetInline: 0,
      },
      left: {
        "--motion-slide-offset": "translateX(-100%)",
        insetBlock: 0,
        left: 0,
      },
      right: {
        "--motion-slide-offset": "translateX(100%)",
        insetBlock: 0,
        right: 0,
      },
      top: {
        "--motion-slide-offset": "translateY(-100%)",
        insetInline: 0,
        top: 0,
      },
    },
    preset: {
      collapse: {
        "& > [data-part=collapse-inner]": {
          minBlockSize: "var(--motion-start-height)",
          overflow: "hidden",
        },
        "&[data-animate-opacity=true][data-state=closed]": { opacity: 0 },
        "&[data-animate-opacity=true][data-state=open]": {
          "@starting-style": { opacity: 0 },
          opacity: 1,
        },
        "&[data-state=closed]": {
          gridTemplateRows: "0fr",
          pointerEvents: "none",
        },
        "&[data-state=open]": {
          "@starting-style": { gridTemplateRows: "0fr" },
          gridTemplateRows: "1fr",
        },
        display: "grid",
        transitionProperty: "grid-template-rows, opacity",
      },
      fade: {
        "&[data-state=closed]": {
          opacity: 0,
          pointerEvents: "none",
          visibility: "hidden",
        },
        "&[data-state=open]": {
          "@starting-style": { opacity: 0 },
          opacity: 1,
          visibility: "visible",
        },
        transitionBehavior: "allow-discrete",
        transitionProperty: "opacity, visibility",
      },
      "scale-fade": {
        "&[data-state=closed]": {
          opacity: 0,
          pointerEvents: "none",
          transform: "scale(var(--motion-scale))",
          visibility: "hidden",
        },
        "&[data-state=open]": {
          "@starting-style": {
            opacity: 0,
            transform: "scale(var(--motion-scale))",
          },
          opacity: 1,
          transform: "scale(1)",
          visibility: "visible",
        },
        transitionBehavior: "allow-discrete",
        transitionProperty: "opacity, transform, visibility",
      },
      slide: {
        "&[data-state=closed]": {
          pointerEvents: "none",
          transform: "var(--motion-slide-offset)",
          visibility: "hidden",
        },
        "&[data-state=open]": {
          "@starting-style": { transform: "var(--motion-slide-offset)" },
          transform: "translate(0, 0)",
          visibility: "visible",
        },
        "--motion-enter-duration": "{durations.slow}",
        "--motion-exit-duration": "{durations.moderate}",
        "--motion-slide-offset": "translateX(100%)",
        position: "fixed",
        transitionBehavior: "allow-discrete",
        transitionProperty: "transform, visibility",
        zIndex: "modal",
      },
      "slide-fade": {
        "&[data-state=closed]": {
          opacity: 0,
          pointerEvents: "none",
          transform: "translate(var(--motion-x), var(--motion-y))",
          visibility: "hidden",
        },
        "&[data-state=open]": {
          "@starting-style": {
            opacity: 0,
            transform: "translate(var(--motion-x), var(--motion-y))",
          },
          opacity: 1,
          transform: "translate(0, 0)",
          visibility: "visible",
        },
        transitionBehavior: "allow-discrete",
        transitionProperty: "opacity, transform, visibility",
      },
    },
  },
})

export type MotionStyle = typeof motionStyle
