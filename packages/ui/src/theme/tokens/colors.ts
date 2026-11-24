import { createPalette } from "../../core/create-palette"

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
