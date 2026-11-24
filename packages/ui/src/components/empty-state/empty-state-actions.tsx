import type { ComponentProps } from "react"
import { splitStyleProps } from "../../core/split-style-props"
import { emptyStateActionsStyle } from "./empty-state-actions.style"

export interface EmptyStateActionsProps extends ComponentProps<"div"> {}

export function EmptyStateActions(props: EmptyStateActionsProps) {
  const [attributes, rest] = splitStyleProps(
    "empty-state-actions",
    emptyStateActionsStyle,
    props,
  )
  return <div {...attributes} {...rest} />
}
