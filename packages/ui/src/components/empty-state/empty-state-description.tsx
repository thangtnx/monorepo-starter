import type { ComponentProps } from "react"
import { splitStyleProps } from "../../core/split-style-props"
import { emptyStateDescriptionStyle } from "./empty-state-description.style"

export interface EmptyStateDescriptionProps extends ComponentProps<"p"> {}

export function EmptyStateDescription(props: EmptyStateDescriptionProps) {
  const [attributes, rest] = splitStyleProps(
    "empty-state-description",
    emptyStateDescriptionStyle,
    props,
  )
  return <p {...attributes} {...rest} />
}
