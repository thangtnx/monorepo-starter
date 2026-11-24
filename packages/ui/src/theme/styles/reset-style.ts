import type { StyleSheet } from "../../core/types"

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
