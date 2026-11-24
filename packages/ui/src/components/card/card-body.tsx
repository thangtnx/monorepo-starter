import type { ComponentProps } from "react"
import { splitStyleProps } from "../../core/split-style-props"
import { cardBodyStyle } from "./card-body.style"

export interface CardBodyProps extends ComponentProps<"div"> {}

export function CardBody(props: CardBodyProps) {
  const [styleAttributes, rest] = splitStyleProps(
    "card-body",
    cardBodyStyle,
    props,
  )

  return <div {...styleAttributes} {...rest} />
}
