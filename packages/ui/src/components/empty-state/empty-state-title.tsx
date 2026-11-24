import type { ComponentProps } from "react"
import { splitStyleProps } from "../../core/split-style-props"
import { emptyStateTitleStyle } from "./empty-state-title.style"

export interface EmptyStateTitleProps extends ComponentProps<"h3"> {}

export function EmptyStateTitle({ children, ...props }: EmptyStateTitleProps) {
  const [attributes, rest] = splitStyleProps(
    "empty-state-title",
    emptyStateTitleStyle,
    props,
  )
  return (
    <h3 {...attributes} {...rest}>
      {children}
    </h3>
  )
}
