import type { ComponentProps } from "react"
import { splitStyleProps } from "../../core/split-style-props"
import { emptyStateIndicatorStyle } from "./empty-state-indicator.style"

export interface EmptyStateIndicatorProps extends ComponentProps<"div"> {}

export function EmptyStateIndicator(props: EmptyStateIndicatorProps) {
  const [attributes, rest] = splitStyleProps(
    "empty-state-indicator",
    emptyStateIndicatorStyle,
    props,
  )
  return <div {...attributes} {...rest} />
}
