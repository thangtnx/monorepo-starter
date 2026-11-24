export const paletteSteps = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const

export type PaletteStep = (typeof paletteSteps)[number]

export type Palette = { [K in PaletteStep]: string }

const lightness = [
  0.98, 0.94, 0.88, 0.8, 0.7, 0.6, 0.51, 0.43, 0.36, 0.29, 0.21,
]
// Chroma peaks in the middle steps; very light and very dark steps leave sRGB otherwise.
const chromaScale = [0.12, 0.25, 0.45, 0.65, 0.85, 1, 1, 0.9, 0.78, 0.64, 0.5]

const round = (value: number) => Number(value.toFixed(3))

/**
 * Builds an 11-step OKLCH scale from one hue and a peak chroma. Steps share
 * lightness across hues, so the same step has similar contrast in every
 * palette.
 */
export function createPalette(hue: number, chroma: number): Palette {
  return Object.fromEntries(
    paletteSteps.map((step, index) => [
      step,
      `oklch(${lightness[index]} ${round(chroma * (chromaScale[index] ?? 1))} ${hue})`,
    ]),
  ) as Palette
}
