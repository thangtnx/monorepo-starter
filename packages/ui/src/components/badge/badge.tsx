import type { ComponentProps } from "react"
import type { ComponentStyleProps } from "../../core/define"
import { splitStyleProps } from "../../core/split-style-props"
import { badgeStyle } from "./badge.style"

export interface BadgeProps
  extends
    Omit<ComponentProps<"span">, "color">,
    ComponentStyleProps<typeof badgeStyle> {}

/** A short inline label, such as a status. Pair the color with text, never color alone. */
export function Badge(props: BadgeProps) {
  const [styleAttributes, rest] = splitStyleProps("badge", badgeStyle, props)

  return <span {...styleAttributes} {...rest} />
}
