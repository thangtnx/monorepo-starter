import type { ComponentProps } from "react"
import { splitStyleProps } from "../../core/split-style-props"
import { alertIconStyle } from "./alert-icon.style"

export interface AlertIconProps extends ComponentProps<"span"> {}

export function AlertIcon(props: AlertIconProps) {
  const [attributes, rest] = splitStyleProps(
    "alert-icon",
    alertIconStyle,
    props,
  )
  return <span aria-hidden="true" {...attributes} {...rest} />
}
