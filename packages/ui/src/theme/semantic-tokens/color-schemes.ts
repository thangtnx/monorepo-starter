import type { ModeValue } from "../../core/types"

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

export const schemeColors = {
  danger: createColorScheme("red"),
  info: createColorScheme("cyan"),
  neutral: createColorScheme("gray", {
    emphasized: ["{colors.gray.800}", "{colors.gray.200}"],
    solid: ["{colors.gray.900}", "{colors.gray.100}"],
  }),
  primary: createColorScheme("blue"),
  success: createColorScheme("green"),
  warning: createColorScheme("amber"),
}
