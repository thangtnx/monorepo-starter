import type { LoadingProps } from "./loading"
import { LoadingIndicator } from "./loading"

export interface LoadingGridProps extends LoadingProps {}

export function LoadingGrid(props: LoadingGridProps) {
  return <LoadingIndicator {...props} scheme="grid" />
}
