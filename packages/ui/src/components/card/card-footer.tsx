import type { ComponentProps } from "react"
import { splitStyleProps } from "../../core/split-style-props"
import { cardFooterStyle } from "./card-footer.style"

export interface CardFooterProps extends ComponentProps<"footer"> {}

export function CardFooter(props: CardFooterProps) {
  const [styleAttributes, rest] = splitStyleProps(
    "card-footer",
    cardFooterStyle,
    props,
  )

  return <footer {...styleAttributes} {...rest} />
}
