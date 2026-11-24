import type { ComponentProps } from "react"
import type { SkeletonProps } from "./skeleton"
import { splitStyleProps } from "../../core/split-style-props"
import { Skeleton } from "./skeleton"
import { skeletonTextStyle } from "./skeleton-text.style"

export interface SkeletonTextProps extends Omit<SkeletonProps, "shape"> {
  /** Spacing between lines, as CSS pixels or a CSS length. */
  gap?: number | string
  /** Number of placeholder lines. @default 3 */
  lineClamp?: number
  /** Attributes of the line container. */
  rootProps?: ComponentProps<"div">
}

export function SkeletonText({
  children,
  gap,
  lineClamp = 3,
  loading = true,
  rootProps,
  ...props
}: SkeletonTextProps) {
  const [attributes, rest] = splitStyleProps(
    "skeleton-text",
    skeletonTextStyle,
    rootProps ?? {},
  )
  const lines = Number.isFinite(lineClamp)
    ? Math.max(0, Math.floor(lineClamp))
    : 3
  return (
    <div
      {...rest}
      {...attributes}
      data-gap={typeof gap === "number" ? `${gap}px` : gap}
    >
      <Skeleton
        {...props}
        hidden={loading && lines === 0}
        loading={loading}
        shape="text"
      >
        {!loading && children}
      </Skeleton>
      {loading &&
        Array.from({ length: Math.max(0, lines - 1) }, (_, index) => (
          <Skeleton
            key={index}
            variant={props.variant}
            duration={props.duration}
            endColor={props.endColor}
            height={props.height}
            shape="text"
            startColor={props.startColor}
            width={props.width}
          />
        ))}
    </div>
  )
}
