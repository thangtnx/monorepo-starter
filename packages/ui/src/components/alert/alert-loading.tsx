import type { LoadingProps } from "../loading/loading"
import type { LoadingScheme } from "../loading/loading-schemes"
import { cx } from "@monorepo/utils"
import { loadingSchemes } from "../loading/loading-schemes"

export interface AlertLoadingProps extends LoadingProps {
  /** The loading indicator to display. @default "oval" */
  loadingScheme?: LoadingScheme
}

export function AlertLoading({
  className,
  loadingScheme = "oval",
  ...props
}: AlertLoadingProps) {
  const Indicator = loadingSchemes[loadingScheme]
  return (
    <Indicator
      {...props}
      className={cx("ui-alert-loading", className)}
      decorative
    />
  )
}
