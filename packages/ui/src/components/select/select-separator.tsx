import type { ComponentProps } from "react"

export interface SelectSeparatorProps extends ComponentProps<"hr"> {}

export function SelectSeparator(props: SelectSeparatorProps) {
  return <hr {...props} data-part="separator" role="presentation" />
}
