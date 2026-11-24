import { theme } from "."

type Mode = 0 | 1

const lookup = (path: string): unknown =>
  path
    .split(".")
    .reduce<unknown>(
      (group, key) => (group as undefined | { [key: string]: unknown })?.[key],
      { ...theme.tokens, semantic: theme.semanticTokens.colors },
    )

/** Resolves a semantic color to its OKLCH string in the given mode. */
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

const channel = (value: number) => {
  const clamped = Math.min(1, Math.max(0, value))

  return clamped
}

/** Relative luminance of an `oklch(L C H)` color, clipped to sRGB. */
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
  const red = channel(
    4.0767416621 * long - 3.3077115913 * medium + 0.2309699292 * short,
  )
  const green = channel(
    -1.2684380046 * long + 2.6097574011 * medium - 0.3413193965 * short,
  )
  const blue = channel(
    -0.0041960863 * long - 0.7034186147 * medium + 1.707614701 * short,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

const contrast = (fg: string, bg: string, mode: Mode) => {
  const [lighter, darker] = [
    luminance(resolve(fg, mode)),
    luminance(resolve(bg, mode)),
  ].toSorted((x, y) => y - x)

  return ((lighter ?? 0) + 0.05) / ((darker ?? 0) + 0.05)
}

const textPairs: [string, string][] = [
  ["fg", "bg"],
  ["fg", "bg.panel"],
  ["fg", "bg.muted"],
  ["fg.muted", "bg"],
  ["fg.muted", "bg.muted"],
  ["fg.muted", "bg.panel"],
  ["fg.muted", "bg.subtle"],
  ...theme.colorSchemes.flatMap((scheme): [string, string][] => [
    [`${scheme}.contrast`, `${scheme}.solid`],
    [`${scheme}.contrast`, `${scheme}.emphasized`],
    [`${scheme}.fg`, `${scheme}.subtle`],
    [`${scheme}.fg`, `${scheme}.muted`],
    [`${scheme}.fg`, "bg"],
  ]),
]

const controlPairs: [string, string][] = [
  ["border.emphasized", "bg"],
  ["focusRing", "bg"],
  ...theme.colorSchemes.map((scheme): [string, string] => [
    `${scheme}.outline`,
    "bg",
  ]),
]

describe.each([
  ["light", 0],
  ["dark", 1],
] as const)("%s mode", (_, mode) => {
  test.each(textPairs)("text %s on %s reaches 4.5:1", (fg, bg) => {
    expect(contrast(fg, bg, mode)).toBeGreaterThanOrEqual(4.5)
  })

  test.each(controlPairs)("control %s on %s reaches 3:1", (fg, bg) => {
    expect(contrast(fg, bg, mode)).toBeGreaterThanOrEqual(3)
  })
})
