import type { ColorScheme } from "../theme"
import type {
  ComponentRecipe,
  ComponentSlotStyle,
  ComponentStyle,
  StyleObject,
  Theme,
} from "./types"

export const defineTheme = <const Y extends Theme>(theme: Y) => theme

export const defineStyle = <const Y extends StyleObject>(style: Y) => style

export const defineComponentStyle = <const Y extends ComponentStyle>(
  style: Y,
) => style

export const defineComponentSlotStyle = <
  const Y extends Omit<ComponentSlotStyle, "kind">,
>(
  style: Y,
) => ({ ...style, kind: "slot" as const })

type Keys<Y> = Extract<keyof NonNullable<Y>, string>

type PropValue<Y> = [Keys<Y>] extends [never]
  ? never
  : [Keys<Y>] extends ["false" | "true"]
    ? boolean
    : Keys<Y>

type Compound<Y extends ComponentRecipe> = NonNullable<Y["compounds"]>[number]
type ConditionKeys<C> = C extends object ? Exclude<Keys<C>, "css"> : never
type ConditionValue<C, K> = C extends object
  ? K extends keyof C
    ? C[K] extends readonly (infer V)[]
      ? V
      : C[K]
    : never
  : never
type Modifier<
  Y extends ComponentRecipe,
  Section extends "sizes" | "variants",
  Key extends string,
> =
  | ConditionValue<Compound<Y>, Key>
  | (Y[Section] extends object ? Keys<Y[Section]> : never)

/** Props inferred from a flat or slot recipe's modifiers and compounds. */
export type ThemeProps<Y extends ComponentRecipe> = {
  /** The color scheme of the component. Children without their own inherit it. */
  colorScheme?: ColorScheme
} & {
  [
    K in "size" | "variant" as Modifier<
      Y,
      K extends "size" ? "sizes" : "variants",
      K
    > extends never
      ? never
      : K
  ]?: Modifier<Y, K extends "size" ? "sizes" : "variants", K>
} & {
  [
    K in Exclude<
      ConditionKeys<Compound<Y>> | Keys<Y["props"]>,
      "colorScheme" | "size" | "variant"
    >
  ]?:
    | ConditionValue<Compound<Y>, K>
    | (K extends keyof NonNullable<Y["props"]>
        ? PropValue<NonNullable<Y["props"]>[K]>
        : never)
}

export type ComponentStyleProps<Y extends ComponentStyle> = ThemeProps<Y>
