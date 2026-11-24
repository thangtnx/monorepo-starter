import type { ComponentProps } from "react"
import { splitStyleProps } from "../../core/split-style-props"
import { visuallyHiddenStyle } from "./visually-hidden.style"

export interface VisuallyHiddenProps extends ComponentProps<"span"> {}

/** Hides content visually while keeping it available to screen readers. */
export function VisuallyHidden(props: VisuallyHiddenProps) {
  const [styleAttributes, rest] = splitStyleProps(
    "visually-hidden",
    visuallyHiddenStyle,
    props,
  )

  return <span {...styleAttributes} {...rest} />
}
