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
  // These keyframes use each animated element's own styles as the implicit `to` frame.
  from: {
    "@keyframes ui-feedback-spin": { transform: "rotate(-360deg)" },
    "@keyframes ui-linear-progress": { transform: "translateX(-25%)" },
    "@keyframes ui-loading-beat": { opacity: 0.45, transform: "scale(0.65)" },
    "@keyframes ui-loading-puff": { opacity: 0.85, transform: "scale(0.5)" },
    "@keyframes ui-progress-stripes": { transform: "translateX(-12px)" },
    "@keyframes ui-skeleton-fade": { opacity: 0 },
    "@keyframes ui-skeleton-pulse": {
      backgroundColor: "var(--skeleton-start, {colors.bg.emphasized})",
    },
    "@keyframes ui-skeleton-shine": { backgroundPosition: "100% 0" },
  },
}
