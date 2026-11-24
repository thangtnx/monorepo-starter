import type {
  ModeValue,
  SemanticTokenGroup,
  StyleValue,
  Theme,
  TokenCategory,
  TokenGroup,
} from "./types"

/** Maps a token path such as `colors.fg.muted` to its CSS variable name. */
export type TokenVars = Map<string, string>

export const toKebab = (value: string) =>
  value.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)

const categoryPatterns: [TokenCategory, RegExp][] = [
  [
    "colors",
    /^(color|background|backgroundColor|border(Top|Right|Bottom|Left|(Block|Inline)(Start|End)?)?Color|outlineColor|fill|stroke|accentColor|caretColor|textDecorationColor)$/,
  ],
  [
    "spaces",
    /^(margin|padding|scrollMargin|scrollPadding|inset)(Top|Right|Bottom|Left|Block|Inline|BlockStart|BlockEnd|InlineStart|InlineEnd)?$|^(gap|rowGap|columnGap|top|right|bottom|left)$/,
  ],
  [
    "sizes",
    /^(min|max)?(Width|Height|BlockSize|InlineSize)$|^(width|height|blockSize|inlineSize|flexBasis)$/,
  ],
  ["radii", /^border(\w*)Radius$/],
  ["fonts", /^fontFamily$/],
  ["fontSizes", /^fontSize$/],
  ["fontWeights", /^fontWeight$/],
  ["lineHeights", /^lineHeight$/],
  ["letterSpacings", /^letterSpacing$/],
  ["shadows", /^boxShadow$/],
  ["durations", /^(transition|animation)(Duration|Delay)$/],
  ["easings", /^(transition|animation)TimingFunction$/],
  ["zIndices", /^zIndex$/],
]

/** Returns the token category whose names a CSS property accepts bare. */
export const getPropertyCategory = (property: string) =>
  categoryPatterns.find(([, pattern]) => pattern.test(property))?.[0]

export const toVarName = (category: string, path: string[]) =>
  `--${[category, ...path.filter((key) => key !== "base")].map(toKebab).join("-")}`

const isLeaf = (value: unknown): value is ModeValue | StyleValue =>
  typeof value !== "object" || Array.isArray(value)

export interface TokenEntry {
  name: string
  value: ModeValue | StyleValue
}

/** Flattens a token group into CSS variable entries. */
export function flattenTokens(
  category: string,
  group: SemanticTokenGroup | TokenGroup,
  path: string[] = [],
): TokenEntry[] {
  return Object.entries(group).flatMap(([key, value]) =>
    isLeaf(value)
      ? [{ name: toVarName(category, [...path, key]), value }]
      : flattenTokens(category, value, [...path, key]),
  )
}

function register(
  vars: TokenVars,
  category: string,
  group: SemanticTokenGroup | TokenGroup,
  path: string[] = [],
) {
  for (const [key, value] of Object.entries(group)) {
    const next = [...path, key]

    if (!isLeaf(value)) {
      register(vars, category, value, next)
      continue
    }

    const name = toVarName(category, next)

    vars.set([category, ...next].join("."), name)
    if (key === "base") vars.set([category, ...path].join("."), name)
  }
}

export const colorSchemeVar = (role: string) => `--color-scheme-${role}`

export function createTokenVars(theme: Theme): TokenVars {
  const vars: TokenVars = new Map()

  for (const [category, group] of Object.entries(theme.tokens))
    register(vars, category, group)

  for (const [category, group] of Object.entries(theme.semanticTokens ?? {}))
    register(vars, category, group)

  for (const role of theme.colorSchemeRoles)
    vars.set(`colors.colorScheme.${role}`, colorSchemeVar(role))

  return vars
}

const tokenReference = /\{([^}]+)\}/g

/**
 * Resolves `{category.path}` references anywhere in the value and, for
 * properties tied to a token category, bare token names such as `fg.muted`.
 */
export function resolveValue(
  property: string,
  value: StyleValue,
  vars: TokenVars,
): string {
  if (typeof value === "number") return String(value)

  const withReferences = value.replace(tokenReference, (_, path: string) => {
    const name = vars.get(path)

    if (!name) throw new Error(`Unknown token "{${path}}"`)

    return `var(${name})`
  })

  const category = getPropertyCategory(property)

  if (!category || withReferences !== value) return withReferences

  return value.replace(/[^\s,]+/g, (part) => {
    const name = vars.get(`${category}.${part}`)
    return name ? `var(${name})` : part
  })
}
