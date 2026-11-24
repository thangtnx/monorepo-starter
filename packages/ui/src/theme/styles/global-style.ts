import type { StyleSheet } from "../../core/types"

export const globalStyle: StyleSheet = {
  "16.7%": {
    "@keyframes ui-loading-ring-center": { transform: "scale(.125)" },
  },
  "50%": {
    "@keyframes ui-loading-pulse": {
      opacity: "var(--loading-mid-opacity)",
      transform: "var(--loading-mid-transform)",
    },
  },
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
  // The other endpoint uses the element's underlying styles.
  from: {
    "@keyframes ui-feedback-fade-in": { opacity: 0 },
    "@keyframes ui-feedback-spin": { transform: "rotate(-360deg)" },
    "@keyframes ui-linear-progress": { transform: "translateX(-25%)" },
    "@keyframes ui-progress-stripes": { transform: "translateX(-12px)" },
    "@keyframes ui-skeleton-pulse": {
      backgroundColor: "var(--skeleton-start, {colors.bg.emphasized})",
    },
    "@keyframes ui-skeleton-shine": { backgroundPosition: "100% 0" },
  },
  to: {
    "@keyframes ui-loading-circle-flash": {
      fillOpacity: "var(--loading-flash-fill)",
    },
    "@keyframes ui-loading-ripple": {
      strokeOpacity: 0,
      strokeWidth: "var(--loading-end-stroke)",
      transform: "var(--loading-end-transform)",
    },
  },
}
