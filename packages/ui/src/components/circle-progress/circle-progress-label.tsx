import type { ComponentProps } from "react"
import { splitStyleProps } from "../../core/split-style-props"
import { circleProgressLabelStyle } from "./circle-progress-label.style"

export interface CircleProgressLabelProps extends ComponentProps<"span"> {}

export function CircleProgressLabel(props: CircleProgressLabelProps) {
  const [attributes, rest] = splitStyleProps(
    "circle-progress-label",
    circleProgressLabelStyle,
    props,
  )
  return <span {...attributes} {...rest} />
}
