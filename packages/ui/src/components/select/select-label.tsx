import type { ComponentProps } from "react"

export interface SelectLabelProps extends ComponentProps<"div"> {}

export function SelectLabel(props: SelectLabelProps) {
  return <div {...props} data-part="label" />
}
