import type { ComponentStyleProps } from "./define"
import type { ComponentRecipe, ComponentStyle } from "./types"
import { cx, dataAttr } from "./merge-props"
import { componentClassName, styleAttributeName } from "./style-attributes"

export type StyleDataAttributes = { [key: `data-${string}`]: string }

export type StyleAttributes = StyleDataAttributes & {
  className: string
}

type StyleKeys<Y extends ComponentStyle> =
  | "className"
  | keyof ComponentStyleProps<Y>

export function stylePropNames(style: ComponentRecipe) {
  const names = new Set(["colorScheme", ...Object.keys(style.props ?? {})])
  if (style.variants) names.add("variant")
  if (style.sizes) names.add("size")
  for (const { css: _, ...conditions } of style.compounds ?? [])
    for (const name of Object.keys(conditions)) names.add(name)
  return names
}

export function resolveStyleAttributes(
  names: Iterable<string>,
  props: { [key: string]: unknown },
  defaults?: { [key: string]: unknown },
) {
  const attributes: StyleDataAttributes = {}
  for (const name of names) {
    const value = props[name] ?? defaults?.[name]
    if (
      typeof value === "string" ||
      typeof value === "boolean" ||
      typeof value === "number"
    )
      attributes[styleAttributeName(name)] = dataAttr(value)
  }
  return attributes
}

/**
 * Turns style props into the component class and `data-*` attributes that the
 * generated stylesheet selects on, falling back to the style's defaults.
 */
export function splitStyleProps<
  Y extends ComponentStyle,
  P extends ComponentStyleProps<Y> & { className?: string },
>(name: string, style: Y, props: P): [StyleAttributes, Omit<P, StyleKeys<Y>>] {
  const { className, ...rest } = props as P & { [key: string]: unknown }
  const names = stylePropNames(style)
  const attributes: StyleAttributes = {
    className: cx(componentClassName(name), className) ?? "",
    ...resolveStyleAttributes(names, rest, style.defaultProps),
  }
  for (const name of names) delete rest[name]

  return [attributes, rest as Omit<P, StyleKeys<Y>>]
}
