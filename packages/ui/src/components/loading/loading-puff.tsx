import type { LoadingProps } from "./loading"
import { LoadingIndicator } from "./loading"

export interface LoadingPuffProps extends LoadingProps {}

export function LoadingPuff(props: LoadingPuffProps) {
  return <LoadingIndicator {...props} scheme="puff" />
}
