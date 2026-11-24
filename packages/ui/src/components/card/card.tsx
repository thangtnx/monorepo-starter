import type { ComponentProps } from "react"
import type { ComponentStyleProps } from "../../core/define"
import { splitStyleProps } from "../../core/split-style-props"
import { cardStyle } from "./card.style"

export interface CardRootProps
  extends
    Omit<ComponentProps<"article">, "color">,
    ComponentStyleProps<typeof cardStyle> {
  /**
   * The palette used by the solid, subtle and surface variants.
   *
   * @default "neutral"
   */
  colorScheme?: ComponentStyleProps<typeof cardStyle>["colorScheme"]
  /**
   * The spacing of the parts and font size of the header.
   *
   * @default "md"
   */
  size?: keyof typeof cardStyle.sizes
  /**
   * The surface treatment for the card.
   *
   * @default "panel"
   */
  variant?: keyof typeof cardStyle.variants
}

export function CardRoot(props: CardRootProps) {
  const [styleAttributes, rest] = splitStyleProps("card", cardStyle, props)

  return <article {...styleAttributes} {...rest} />
}
