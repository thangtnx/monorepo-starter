import type { ComponentProps } from "react"
import { splitStyleProps } from "../../core/split-style-props"
import { alertTitleStyle } from "./alert-title.style"

export interface AlertTitleProps extends ComponentProps<"p"> {}

export function AlertTitle(props: AlertTitleProps) {
  const [attributes, rest] = splitStyleProps(
    "alert-title",
    alertTitleStyle,
    props,
  )
  return <p {...attributes} {...rest} />
}
