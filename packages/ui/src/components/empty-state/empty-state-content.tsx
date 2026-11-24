import type { ComponentProps } from "react"
import { splitStyleProps } from "../../core/split-style-props"
import { emptyStateContentStyle } from "./empty-state-content.style"

export interface EmptyStateContentProps extends ComponentProps<"div"> {}

export function EmptyStateContent(props: EmptyStateContentProps) {
  const [attributes, rest] = splitStyleProps(
    "empty-state-content",
    emptyStateContentStyle,
    props,
  )
  return <div {...attributes} {...rest} />
}
