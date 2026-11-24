import type { ComponentProps } from "react"
import { splitStyleProps } from "../../core/split-style-props"
import { alertDescriptionStyle } from "./alert-description.style"

export interface AlertDescriptionProps extends ComponentProps<"span"> {}

export function AlertDescription(props: AlertDescriptionProps) {
  const [attributes, rest] = splitStyleProps(
    "alert-description",
    alertDescriptionStyle,
    props,
  )
  return <span {...attributes} {...rest} />
}
