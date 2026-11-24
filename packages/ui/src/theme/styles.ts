import type { StyleSheet } from "../core/types"

export const layerStyles: StyleSheet = {
  disabled: {
    boxShadow: "none",
    cursor: "not-allowed",
    opacity: 0.5,
  },
  ghost: {
    background: "transparent",
    color: "colorScheme.fg",
    _hover: { background: "colorScheme.subtle" },
  },
  outline: {
    background: "transparent",
    borderColor: "colorScheme.outline",
    color: "colorScheme.fg",
    _hover: { background: "colorScheme.subtle" },
  },
  solid: {
    background: "colorScheme.solid",
    color: "colorScheme.contrast",
    _hover: { background: "colorScheme.emphasized" },
  },
  subtle: {
    background: "colorScheme.subtle",
    color: "colorScheme.fg",
    _hover: { background: "colorScheme.muted" },
  },
}

export const textStyles: StyleSheet = {
  body: { fontSize: "md", lineHeight: "normal" },
  "body.lg": { fontSize: "lg", lineHeight: "tall" },
  "body.sm": { fontSize: "sm", lineHeight: "normal" },
  caption: { fontSize: "xs", fontWeight: "medium", lineHeight: "short" },
  display: {
    fontFamily: "heading",
    fontSize: "5xl",
    fontWeight: "bold",
    letterSpacing: "tight",
    lineHeight: "shorter",
  },
  h1: {
    fontFamily: "heading",
    fontSize: "3xl",
    fontWeight: "bold",
    lineHeight: "shorter",
  },
  h2: {
    fontFamily: "heading",
    fontSize: "2xl",
    fontWeight: "semibold",
    lineHeight: "short",
  },
  h3: {
    fontFamily: "heading",
    fontSize: "lg",
    fontWeight: "semibold",
    lineHeight: "short",
  },
  label: { fontSize: "sm", fontWeight: "semibold", lineHeight: "shorter" },
}

// `:where()` keeps the reset at zero specificity.
export const resetStyle: StyleSheet = {
  ":where(*, *::before, *::after)": {
    borderStyle: "solid",
    borderWidth: 0,
    boxSizing: "border-box",
    margin: 0,
    padding: 0,
  },
  ":where([hidden])": { display: "none" },
  ":where(a)": { color: "inherit", textDecoration: "inherit" },
  ":where(button, input, select, textarea)": {
    background: "transparent",
    color: "inherit",
    font: "inherit",
    letterSpacing: "inherit",
  },
  ":where(h1, h2, h3, h4, h5, h6, p)": { overflowWrap: "break-word" },
  ":where(html)": {
    lineHeight: 1.5,
    textSizeAdjust: "100%",
    WebkitTextSizeAdjust: "100%",
  },
  ":where(img, svg, video, canvas, audio, iframe, embed, object)": {
    display: "block",
    maxWidth: "100%",
  },
  ":where(ol, ul)": { listStyle: "none" },
}

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
