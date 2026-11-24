import type { SkeletonProps } from "./skeleton"
import { Skeleton } from "./skeleton"

export interface SkeletonCircleProps extends Omit<SkeletonProps, "shape"> {}

export function SkeletonCircle({
  height,
  width,
  ...props
}: SkeletonCircleProps) {
  return <Skeleton {...props} height={height ?? width} shape="circle" />
}
