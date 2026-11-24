import type { ColorScheme } from "../theme"
import type { ComponentStyle, StyleObject, Theme } from "./types"

export const defineTheme = <const Y extends Theme>(theme: Y) => theme

export const defineStyle = <const Y extends StyleObject>(style: Y) => style

export const defineComponentStyle = <const Y extends ComponentStyle>(
  style: Y,
) => style

type Keys<Y> = Extract<keyof NonNullable<Y>, string>

type PropValue<Y> = [Keys<Y>] extends ["false" | "true"] ? boolean : Keys<Y>

/** Props a component gets from its style: `variant`, `size`, `colorScheme` and extra props. */
export type ComponentStyleProps<Y extends ComponentStyle> =
  (Y["sizes"] extends object
    ? {
        /**
         * The size of the component.
         */
        size?: Keys<Y["sizes"]>
      }
    : unknown) &
    (Y["variants"] extends object
      ? {
          /**
           * The visual variant of the component.
           */
          variant?: Keys<Y["variants"]>
        }
      : unknown) & {
      /**
       * The color scheme of the component. Children without their own inherit it.
       */
      colorScheme?: ColorScheme
    } & {
      [K in Keys<Y["props"]>]?: PropValue<NonNullable<Y["props"]>[K]>
    }
