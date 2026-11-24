import type { ModeValue } from "../core/types"

export const colorSchemeRoles = [
  "contrast",
  "emphasized",
  "fg",
  "muted",
  "outline",
  "solid",
  "subtle",
] as const

type ColorSchemeRole = (typeof colorSchemeRoles)[number]

const step = (palette: string, value: number) => `{colors.${palette}.${value}}`

/** Semantic roles of one color scheme, built from a palette. */
const createColorScheme = (
  palette: string,
  overrides: { [K in ColorSchemeRole]?: ModeValue } = {},
): { [K in ColorSchemeRole]: ModeValue } => ({
  contrast: ["{colors.white}", "{colors.gray.950}"],
  emphasized: [step(palette, 700), step(palette, 300)],
  fg: [step(palette, 700), step(palette, 300)],
  muted: [step(palette, 200), step(palette, 800)],
  outline: [step(palette, 500), step(palette, 500)],
  solid: [step(palette, 600), step(palette, 400)],
  subtle: [step(palette, 100), step(palette, 900)],
  ...overrides,
})

export const colorSchemes = [
  "danger",
  "info",
  "neutral",
  "primary",
  "success",
  "warning",
] as const

export type ColorScheme = (typeof colorSchemes)[number]

export const semanticTokens = {
  colors: {
    bg: {
      base: ["{colors.white}", "{colors.gray.950}"],
      emphasized: ["{colors.gray.200}", "{colors.gray.700}"],
      muted: ["{colors.gray.100}", "{colors.gray.800}"],
      panel: ["{colors.white}", "{colors.gray.900}"],
      subtle: ["{colors.gray.50}", "{colors.gray.900}"],
    },
    border: {
      base: ["{colors.gray.200}", "{colors.gray.800}"],
      // Control borders: at least 3:1 against the page in both modes.
      emphasized: ["{colors.gray.500}", "{colors.gray.500}"],
      muted: ["{colors.gray.100}", "{colors.gray.900}"],
    },
    danger: createColorScheme("red"),
    fg: {
      base: ["{colors.gray.950}", "{colors.gray.50}"],
      muted: ["{colors.gray.600}", "{colors.gray.400}"],
    },
    focusRing: ["{colors.blue.600}", "{colors.blue.400}"],
    info: createColorScheme("cyan"),
    neutral: createColorScheme("gray", {
      emphasized: ["{colors.gray.800}", "{colors.gray.200}"],
      solid: ["{colors.gray.900}", "{colors.gray.100}"],
    }),
    primary: createColorScheme("blue"),
    success: createColorScheme("green"),
    warning: createColorScheme("amber"),
  },
  shadows: {
    sm: [
      "0 1px 2px oklch(0.21 0.02 258 / 0.08)",
      "0 1px 2px oklch(0 0 0 / 0.4)",
    ],
    md: [
      "0 6px 20px oklch(0.21 0.02 258 / 0.12)",
      "0 6px 20px oklch(0 0 0 / 0.5)",
    ],
    lg: [
      "0 16px 48px oklch(0.21 0.02 258 / 0.18)",
      "0 16px 48px oklch(0 0 0 / 0.6)",
    ],
  },
} as const
