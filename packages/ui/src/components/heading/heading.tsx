import type { ComponentProps } from "react"
import type { ComponentStyleProps } from "../../core/define"
import { splitStyleProps } from "../../core/split-style-props"
import { headingStyle } from "./heading.style"

export interface HeadingProps
  extends
    Omit<ComponentProps<"h2">, "color">,
    ComponentStyleProps<typeof headingStyle> {
  /**
   * The native heading element. Choose the level from the document outline.
   *
   * @default "h2"
   */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  /**
   * The visual typography preset.
   *
   * @default The preset matching `as`.
   */
  variant?: keyof typeof headingStyle.variants
}

export function Heading({
  as: Tag = "h2",
  variant = Tag,
  ...props
}: HeadingProps) {
  const [styleAttributes, rest] = splitStyleProps("heading", headingStyle, {
    ...props,
    variant,
  })

  return <Tag {...styleAttributes} {...rest} />
}
