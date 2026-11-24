import { createPalette } from "../core/create-palette"

// Neutral placeholder hues. A brand palette only needs a new hue and chroma
// here.
export const colors = {
  black: "oklch(0 0 0)",
  amber: createPalette(70, 0.16),
  blue: createPalette(258, 0.17),
  cyan: createPalette(222, 0.12),
  gray: createPalette(258, 0.02),
  green: createPalette(150, 0.15),
  red: createPalette(25, 0.19),
  white: "oklch(1 0 0)",
}

const spaceSteps = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24]

/** Multiples of 0.25rem: `4` is 1rem. */
export const spaces = Object.fromEntries(
  spaceSteps.map((step) => [step, `${step * 0.25}rem`]),
)

export const sizes = {
  ...spaces,
  xs: "20rem",
  sm: "24rem",
  md: "28rem",
  lg: "32rem",
  xl: "36rem",
  "2xl": "42rem",
  "3xl": "48rem",
  "4xl": "56rem",
  "5xl": "64rem",
  "6xl": "72rem",
  "7xl": "80rem",
  full: "100%",
}

export const radii = {
  sm: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  "3xl": "1.5rem",
  full: "9999px",
  none: "0",
}

export const fonts = {
  body: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  heading:
    'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  mono: 'ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace',
}

export const fontSizes = {
  xs: "0.75rem",
  sm: "0.875rem",
  md: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
  "5xl": "3rem",
  "6xl": "3.75rem",
}

export const fontWeights = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
}

export const lineHeights = {
  shorter: 1.25,
  short: 1.375,
  normal: 1.5,
  tall: 1.625,
}

export const letterSpacings = {
  tighter: "-0.04em",
  tight: "-0.02em",
  normal: "0",
  wide: "0.02em",
}

export const durations = {
  faster: "80ms",
  fast: "120ms",
  moderate: "200ms",
  slow: "300ms",
  slower: "400ms",
}

export const easings = {
  in: "cubic-bezier(0.4, 0, 1, 1)",
  inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  out: "cubic-bezier(0, 0, 0.2, 1)",
  standard: "cubic-bezier(0.2, 0, 0, 1)",
}

export const zIndices = {
  base: 0,
  docked: 10,
  dropdown: 1000,
  hide: -1,
  modal: 1400,
  overlay: 1300,
  popover: 1500,
  sticky: 1100,
  toast: 1700,
  tooltip: 1800,
}

export const breakpoints = {
  sm: "30em",
  md: "48em",
  lg: "62em",
  xl: "80em",
  "2xl": "96em",
}

export const tokens = {
  breakpoints,
  colors,
  durations,
  easings,
  fonts,
  fontSizes,
  fontWeights,
  letterSpacings,
  lineHeights,
  radii,
  sizes,
  spaces,
  zIndices,
}
