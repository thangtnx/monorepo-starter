import type { ComponentProps } from "react"
import type { ComponentStyleProps } from "../../core/define"
import { Children } from "react"
import { splitStyleProps } from "../../core/split-style-props"
import { skeletonStyle } from "./skeleton.style"

export interface SkeletonProps
  extends
    Omit<ComponentProps<"div">, "color">,
    ComponentStyleProps<typeof skeletonStyle> {
  /** Duration of the loading animation in seconds or as a CSS time. */
  duration?: number | string
  /** Ending CSS color for the loading animation. */
  endColor?: string
  /** Duration of the loaded content's fade in. @default 0.1 */
  fadeDuration?: number | string
  /** Use the children's width while loading. Defaults to true when children are present. */
  fitContent?: boolean
  /** Placeholder height, as CSS pixels or a CSS length. */
  height?: number | string
  /** Show the placeholder and hide its children. @default true */
  loading?: boolean
  /** Placeholder geometry. @default "block" */
  shape?: "block" | "circle" | "text"
  /** Starting CSS color for the loading animation. */
  startColor?: string
  /** Placeholder width, as CSS pixels or a CSS length. */
  width?: number | string
}

export function Skeleton({
  children,
  duration,
  endColor,
  fadeDuration,
  fitContent = Children.toArray(children).length > 0,
  height,
  loading = true,
  shape = "block",
  startColor,
  width,
  ...props
}: SkeletonProps) {
  const [attributes, rest] = splitStyleProps("skeleton", skeletonStyle, props)
  const animationDuration = loading ? duration : fadeDuration
  return (
    <div
      {...rest}
      {...attributes}
      aria-hidden={loading ? true : rest["aria-hidden"]}
      data-duration={
        typeof animationDuration === "number"
          ? `${animationDuration}s`
          : animationDuration
      }
      data-end-color={endColor}
      data-fit-content={fitContent}
      data-height={typeof height === "number" ? `${height}px` : height}
      data-loading={loading}
      data-shape={shape}
      data-start-color={startColor}
      data-width={typeof width === "number" ? `${width}px` : width}
      inert={loading || rest.inert}
    >
      <div className="ui-skeleton-content">{children}</div>
    </div>
  )
}
