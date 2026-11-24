import type { LoadingProps } from "./loading"
import { LoadingIndicator } from "./loading"

export interface LoadingRingsProps extends LoadingProps {}

export function LoadingRings(props: LoadingRingsProps) {
  return <LoadingIndicator {...props} scheme="rings" />
}
