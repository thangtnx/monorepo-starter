import { componentStyles } from "../../component-styles"
import { compileComponentStyle } from "../../core/create-css"
import { createTokenVars } from "../../core/tokens"
import { theme } from "../../theme"

type Mode = 0 | 1

const lookup = (path: string): unknown =>
  path
    .split(".")
    .reduce<unknown>(
      (group, key) => (group as undefined | { [key: string]: unknown })?.[key],
      { ...theme.tokens, semantic: theme.semanticTokens.colors },
    )

function resolve(path: string, mode: Mode): string {
  const group = lookup(`semantic.${path}`)
  const semantic = Array.isArray(group)
    ? group
    : lookup(`semantic.${path}.base`)
  const value = Array.isArray(semantic)
    ? semantic[mode]
    : lookup(`colors.${path}`)

  if (typeof value !== "string") throw new Error(`No color for ${path}`)

  const reference = /^\{colors\.(.+)\}$/.exec(value)

  return reference?.[1] ? resolve(reference[1], mode) : value
}

const clamp = (value: number) => Math.min(1, Math.max(0, value))

function luminance(color: string): number {
  const [l = 0, c = 0, h = 0] = color
    .replace(/oklch\(|\)/g, "")
    .split(" ")
    .map(Number)
  const a = c * Math.cos((h * Math.PI) / 180)
  const b = c * Math.sin((h * Math.PI) / 180)
  const long = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const medium = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const short = (l - 0.0894841775 * a - 1.291485548 * b) ** 3

  return (
    0.2126 *
      clamp(
        4.0767416621 * long - 3.3077115913 * medium + 0.2309699292 * short,
      ) +
    0.7152 *
      clamp(
        -1.2684380046 * long + 2.6097574011 * medium - 0.3413193965 * short,
      ) +
    0.0722 *
      clamp(-0.0041960863 * long - 0.7034186147 * medium + 1.707614701 * short)
  )
}

const contrast = (fg: string, bg: string, mode: Mode) => {
  const [lighter, darker] = [
    luminance(resolve(fg, mode)),
    luminance(resolve(bg, mode)),
  ].toSorted((x, y) => y - x)

  return ((lighter ?? 0) + 0.05) / ((darker ?? 0) + 0.05)
}

const rules = compileComponentStyle(
  "select-listbox",
  componentStyles["select-listbox"]!,
  { theme, vars: createTokenVars(theme) },
)
const option = ".ui-select-listbox [data-part=option]"
const states = [
  ["plain", [option]],
  ["selected", [option, `${option}[aria-selected=true]`]],
  ["active", [option, `${option}[data-active]`]],
  [
    "selected and active",
    [
      option,
      `${option}[aria-selected=true]`,
      `${option}[data-active]`,
      `${option}[aria-selected=true][data-active]`,
    ],
  ],
] as const

// The last matching declaration wins, falling back to the panel's own colors.
function cascade(
  selectors: readonly string[],
  property: string,
  fallback: string,
) {
  const prefix = `${property}: var(`
  const values = [
    ...rules.filter((rule) => rule.selector === ".ui-select-listbox"),
    ...selectors.flatMap((selector) =>
      rules.filter((rule) => rule.selector === selector),
    ),
  ]
    .flatMap((rule) => rule.declarations)
    .filter((value) => value.startsWith(prefix))

  return (values.at(-1) ?? `${prefix}${fallback})`).slice(prefix.length, -1)
}

const path = (variable: string, scheme: string) =>
  variable === "--color-scheme-fg" || variable === "--color-scheme-subtle"
    ? `${scheme}.${variable.slice("--color-scheme-".length)}`
    : variable.replace("--colors-", "").replaceAll("-", ".")

describe.each([
  ["light", 0],
  ["dark", 1],
] as const)("select option contrast in %s mode", (_, mode) => {
  describe.each(theme.colorSchemes)("%s scheme", (scheme) => {
    test.each(states)("%s option text reaches 4.5:1", (_state, selectors) => {
      const color = path(cascade(selectors, "color", "--colors-fg"), scheme)
      const background = path(
        cascade(selectors, "background", "--colors-bg-panel"),
        scheme,
      )

      expect(contrast(color, background, mode)).toBeGreaterThanOrEqual(4.5)
    })
  })
})
