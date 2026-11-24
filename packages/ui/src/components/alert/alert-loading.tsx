import type { LoadingProps, LoadingScheme } from "../loading/loading"
import { splitStyleProps } from "../../core/split-style-props"
import { LoadingIndicator } from "../loading/loading"
import { alertLoadingStyle } from "./alert-loading.style"

export interface AlertLoadingProps extends LoadingProps {
  /** The loading indicator to display. @default "oval" */
  loadingScheme?: LoadingScheme
}

export function AlertLoading({ loadingScheme, ...props }: AlertLoadingProps) {
  const [attributes, rest] = splitStyleProps(
    "alert-loading",
    alertLoadingStyle,
    props,
  )
  return (
    <LoadingIndicator
      {...attributes}
      {...rest}
      decorative
      scheme={loadingScheme}
    />
  )
}
