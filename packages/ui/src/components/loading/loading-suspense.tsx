import type { ComponentProps, SuspenseProps } from "react"
import type { LoadingProps } from "./loading"
import type { LoadingScheme } from "./loading-schemes"
import { Suspense } from "react"
import { splitStyleProps } from "../../core/split-style-props"
import { loadingSchemes } from "./loading-schemes"
import { loadingSuspenseStyle } from "./loading-suspense.style"

export interface LoadingSuspenseProps
  extends SuspenseProps, Omit<ComponentProps<"div">, keyof SuspenseProps> {
  /** The indicator to show in the default fallback. @default "oval" */
  loadingScheme?: LoadingScheme
  /** Props forwarded to the default loading indicator. */
  loadingProps?: LoadingProps
  /** Extra attributes for the default status wrapper. */
  statusProps?: ComponentProps<"div">
}

export function LoadingSuspense({
  name,
  children,
  fallback,
  loadingScheme = "oval",
  loadingProps,
  statusProps,
  ...props
}: LoadingSuspenseProps) {
  const Indicator = loadingSchemes[loadingScheme]
  const [attributes, rest] = splitStyleProps(
    "loading-suspense",
    loadingSuspenseStyle,
    {
      ...props,
      ...statusProps,
    },
  )

  return (
    <Suspense
      name={name}
      fallback={
        fallback === undefined ? (
          <div role="status" {...rest} {...attributes}>
            <Indicator {...loadingProps} />
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
