import type { ComponentStyleProps } from "./define"
import type { ComponentStyle } from "./types"
import { cx } from "@monorepo/utils"
import { componentClassName } from "./create-css"
import { toKebab } from "./tokens"

export type StyleAttributes = { [key: `data-${string}`]: string } & {
  className: string
}

type StyleKeys<Y extends ComponentStyle> =
  | "className"
  | keyof ComponentStyleProps<Y>

/**
 * Turns style props into the component class and `data-*` attributes that the
 * generated stylesheet selects on, falling back to the style's defaults.
 */
export function splitStyleProps<
  Y extends ComponentStyle,
  P extends ComponentStyleProps<Y> & { className?: string },
>(name: string, style: Y, props: P): [StyleAttributes, Omit<P, StyleKeys<Y>>] {
  const { className, ...rest } = props as P & { [key: string]: unknown }
  const attributes: StyleAttributes = {
    className: cx(componentClassName(name), className) ?? "",
  }
  const take = (prop: string, attribute: string) => {
    const value = (rest[prop] ?? style.defaultProps?.[prop]) as
      | boolean
      | string
      | undefined

    delete rest[prop]
    if (value !== undefined) attributes[`data-${attribute}`] = String(value)
  }

  if (style.variants) take("variant", "variant")
  if (style.sizes) take("size", "size")
  take("colorScheme", "scheme")
  for (const prop of Object.keys(style.props ?? {})) take(prop, toKebab(prop))

  return [attributes, rest as Omit<P, StyleKeys<Y>>]
}
