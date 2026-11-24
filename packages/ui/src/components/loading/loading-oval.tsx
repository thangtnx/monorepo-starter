import type { LoadingProps } from "./loading"
import { LoadingIndicator } from "./loading"

export interface LoadingOvalProps extends LoadingProps {}

export function LoadingOval(props: LoadingOvalProps) {
  return <LoadingIndicator {...props} scheme="oval" />
}
