import type { LoadingProps } from "./loading"
import { LoadingIndicator } from "./loading"

export interface LoadingDotsProps extends LoadingProps {}

export function LoadingDots(props: LoadingDotsProps) {
  return <LoadingIndicator {...props} scheme="dots" />
}
