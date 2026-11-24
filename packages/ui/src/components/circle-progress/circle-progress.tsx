import type { ComponentProps } from "react"
import type { ComponentStyleProps } from "../../core/define"
import type { UseProgressProps } from "../progress/use-progress"
import { splitStyleProps } from "../../core/split-style-props"
import { spaces } from "../../theme/tokens/spaces"
import { progressPaint, useProgress } from "../progress/use-progress"
import { circleProgressStyle } from "./circle-progress.style"

export interface CircleProgressCircleProps extends ComponentProps<"svg"> {}
export interface CircleProgressRangeProps extends ComponentProps<"circle"> {}
export interface CircleProgressTrackProps extends ComponentProps<"circle"> {}

export interface CircleProgressRootProps
  extends
    Omit<ComponentProps<"div">, "color">,
    ComponentStyleProps<typeof circleProgressStyle>,
    UseProgressProps {
  /** Custom width and height for the SVG viewport, in CSS pixels or a CSS length. */
  boxSize?: number | string
  /** Animation duration in seconds or as a CSS time. @default 1.5 */
  duration?: number | string
  /** CSS color or color token for the completed range. */
  rangeColor?: string
  /** Stroke width in SVG units or an SVG length. Defaults to the selected size. */
  thickness?: number | string
  /** CSS color or color token for the track. */
  trackColor?: string
  /** SVG attributes forwarded to the circle container. */
  circleProps?: CircleProgressCircleProps
  /** SVG attributes forwarded to the range. */
  rangeProps?: CircleProgressRangeProps
  /** SVG attributes forwarded to the track. */
  trackProps?: CircleProgressTrackProps
}

const diameters = { xs: 24, sm: 32, md: 40, lg: 48, xl: 56 }
const dimensions = {
  xs: spaces[6],
  sm: spaces[8],
  md: spaces[10],
  lg: spaces[12],
  xl: spaces[14],
}
const strokes = { xs: 4, sm: 6, md: 6, lg: 8, xl: 8 }

export function CircleProgressRoot({
  size = "md",
  "aria-label": label,
  "aria-labelledby": labelledBy,
  "aria-valuetext": ariaValueText,
  boxSize = dimensions[size],
  children,
  defaultLabel,
  duration,
  indeterminate,
  indeterminateText,
  max,
  min,
  rangeColor,
  shape = "rounded",
  thickness = strokes[size],
  trackColor,
  value,
  valueText,
  circleProps,
  rangeProps,
  trackProps,
  ...props
}: CircleProgressRootProps) {
  const progress = useProgress<"div">({
    defaultLabel,
    indeterminate,
    indeterminateText,
    max,
    min,
    value,
    valueText: ariaValueText ?? valueText,
  })
  const [attributes, rest] = splitStyleProps(
    "circle-progress",
    circleProgressStyle,
    { ...props, size, shape },
  )
  const rootProps = progress.getRootProps()
  const diameter = diameters[size]
  const center = diameter / 2
  const numericStroke =
    typeof thickness === "number" ? thickness : Number(thickness)
  const strokeWidth = Number.isFinite(numericStroke)
    ? Math.max(0, Math.min(center, numericStroke))
    : thickness
  const radius =
    center - (typeof strokeWidth === "number" ? strokeWidth : strokes[size]) / 2
  const geometry = { cx: center, cy: center, r: radius, strokeWidth }
  const percent = progress.indeterminate ? 25 : progress.percent

  return (
    <div
      {...rest}
      {...attributes}
      {...rootProps}
      aria-label={label ?? (labelledBy ? undefined : rootProps["aria-label"])}
      aria-labelledby={labelledBy}
      data-duration={typeof duration === "number" ? `${duration}s` : duration}
    >
      <svg
        fill="none"
        height={boxSize}
        viewBox={`0 0 ${diameter} ${diameter}`}
        width={boxSize}
        {...circleProps}
        aria-hidden="true"
        focusable="false"
      >
        <circle
          {...geometry}
          stroke={progressPaint(trackColor, "var(--circle-track)")}
          {...trackProps}
        />
        <g transform={`rotate(-90 ${center} ${center})`}>
          <circle
            {...geometry}
            pathLength="100"
            stroke={progressPaint(rangeColor, "var(--circle-range)")}
            strokeDasharray={percent === 100 ? undefined : `${percent} 100`}
            strokeLinecap={shape === "rounded" ? "round" : "butt"}
            visibility={percent > 0 ? undefined : "hidden"}
            {...rangeProps}
            className={["ui-circle-progress-range", rangeProps?.className]
              .filter(Boolean)
              .join(" ")}
          />
        </g>
      </svg>
      {children}
    </div>
  )
}
