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

export type CompoundValue = boolean | StyleValue

/** All conditions must match. An array allows any of its values. */
export type ComponentCompound<Style = StyleObject> = {
  [prop: string]: CompoundValue | readonly CompoundValue[] | Style | undefined
  css: Style
}

type StyleDefaults = { [prop: string]: unknown } & {
  colorScheme?: string
  size?: string
  variant?: string
}

export interface ComponentStyle {
  base?: StyleObject
  compounds?: readonly ComponentCompound[]
  /** Extra props that map to `data-*` attributes, keyed by prop then value. */
  props?: { [prop: string]: StyleSheet }
  sizes?: StyleSheet
  variants?: StyleSheet
  defaultProps?: StyleDefaults
}

/** Modifier values resolve to style objects keyed by slot, including `root`. */
export interface ComponentSlotStyle<Slot extends string = string> {
  kind: "slot"
  base?: SlotStyles<Slot>
  compounds?: readonly ComponentCompound<SlotStyles<Slot>>[]
  props?: { [prop: string]: { [value: string]: SlotStyles<Slot> } }
  sizes?: { [key: string]: SlotStyles<Slot> }
  variants?: { [key: string]: SlotStyles<Slot> }
  defaultProps?: { [K in "root" | Slot]?: StyleDefaults }
}

type SlotStyles<Slot extends string> = { [K in "root" | Slot]?: StyleObject }

export type ComponentRecipe = ComponentSlotStyle | ComponentStyle

/** Style objects keyed by selector or by name. */
export interface StyleSheet {
  [key: string]: StyleObject
}
