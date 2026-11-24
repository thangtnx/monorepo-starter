import type { ComponentProps } from "react"
import { splitStyleProps } from "../../core/split-style-props"
import { cardHeaderStyle } from "./card-header.style"

export interface CardHeaderProps extends ComponentProps<"header"> {}

export function CardHeader(props: CardHeaderProps) {
  const [styleAttributes, rest] = splitStyleProps(
    "card-header",
    cardHeaderStyle,
    props,
  )

  return <header {...styleAttributes} {...rest} />
}
