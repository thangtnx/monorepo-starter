import type { StyleSheet } from "../../core/types"

export const globalStyle: StyleSheet = {
  "*, *::before, *::after": {
    _motionReduce: {
      animationDuration: "1ms !important",
      animationIterationCount: "1 !important",
      scrollBehavior: "auto !important",
      transitionDuration: "1ms !important",
    },
  },
  "::selection": { background: "{colors.primary.muted}" },
  ":focus-visible": {
    outline: "2px solid {colors.focusRing}",
    outlineOffset: "2px",
  },
  body: {
    background: "bg",
    color: "fg",
    fontFamily: "body",
    lineHeight: "normal",
    WebkitFontSmoothing: "antialiased",
  },
}
