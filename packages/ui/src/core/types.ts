export type StyleValue = number | string

export interface StyleObject {
  [key: string]: StyleObject | StyleValue | undefined
}

/** A value that differs between light and dark mode: `[light, dark]`. */
export type ModeValue = readonly [light: StyleValue, dark: StyleValue]

export interface TokenGroup {
  [key: string]: StyleValue | TokenGroup
}

export interface SemanticTokenGroup {
  [key: string]: ModeValue | SemanticTokenGroup | StyleValue
}

export type TokenCategory =
  | "breakpoints"
  | "colors"
  | "durations"
  | "easings"
  | "fonts"
  | "fontSizes"
  | "fontWeights"
  | "letterSpacings"
  | "lineHeights"
  | "radii"
  | "shadows"
  | "sizes"
  | "spaces"
  | "zIndices"

export interface Theme {
  /** Roles every color scheme defines, such as `solid` or `fg`. */
  colorSchemeRoles: readonly string[]
  /** Palette names that `colorScheme` accepts. Each needs `colors.<name>.*` semantic roles. */
  colorSchemes: readonly string[]
  tokens: { [K in TokenCategory]?: TokenGroup }
  /** Selector to style, applied after the reset. */
  globalStyle?: StyleSheet
  layerStyles?: StyleSheet
  resetStyle?: StyleSheet
  semanticTokens?: { [K in TokenCategory]?: SemanticTokenGroup }
  textStyles?: StyleSheet
}

export interface ComponentStyle {
  base?: StyleObject
  /** Extra props that map to `data-*` attributes, keyed by prop then value. */
  props?: { [prop: string]: StyleSheet }
  sizes?: StyleSheet
  variants?: StyleSheet
  defaultProps?: { [prop: string]: unknown } & {
    colorScheme?: string
    size?: string
    variant?: string
  }
}

/** Style objects keyed by selector or by name. */
export interface StyleSheet {
  [key: string]: StyleObject
}
