import type { ComponentProps, SuspenseProps } from "react"
import type { LoadingProps, LoadingScheme } from "./loading"
import { Suspense } from "react"
import { LoadingIndicator } from "./loading"

export interface LoadingSuspenseProps extends SuspenseProps {
  /** The indicator to show in the default fallback. @default "oval" */
  loadingScheme?: LoadingScheme
  /** Props forwarded to the default loading indicator. */
  loadingProps?: LoadingProps
  /** Props forwarded to the default status wrapper. */
  statusProps?: ComponentProps<"div">
}

export function LoadingSuspense({
  children,
  fallback,
  loadingScheme,
  loadingProps,
  statusProps,
}: LoadingSuspenseProps) {
  return (
    <Suspense
      fallback={
        fallback === undefined ? (
          <div role="status" {...statusProps}>
            <LoadingIndicator {...loadingProps} scheme={loadingScheme} />
          </div>
        ) : (
          fallback
        )
      }
    >
      {children}
    </Suspense>
  )
}
