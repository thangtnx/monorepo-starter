import type { LoadingProps } from "./loading"
import { LoadingIndicator } from "./loading"

export interface LoadingCirclesProps extends LoadingProps {}

export function LoadingCircles(props: LoadingCirclesProps) {
  return <LoadingIndicator {...props} scheme="circles" />
}
