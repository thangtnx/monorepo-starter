"use client"

import type { ComponentProps, CSSProperties } from "react"
import type { ComponentStyleProps } from "../../core/define"
import type { UseProgressProps } from "./use-progress"
import { useId } from "react"
import { splitStyleProps } from "../../core/split-style-props"
import { feedbackValue } from "../loading/feedback-style"
import { progressStyle } from "./progress.style"
import { progressPaint, useProgress } from "./use-progress"

export interface ProgressRangeProps extends ComponentProps<"rect"> {}

export interface ProgressProps
  extends
    Omit<ComponentProps<"div">, "color">,
    ComponentStyleProps<typeof progressStyle>,
    UseProgressProps {
  /** Animation duration in seconds or as a CSS time. @default 1 */
  duration?: number | string
  /** CSS color or color token for the completed range. */
  rangeColor?: string
  /** CSS color or color token for the track. */
  trackColor?: string
  /** SVG attributes forwarded to the completed range. */
  rangeProps?: ProgressRangeProps
}

export function Progress({
  "aria-label": label,
  "aria-labelledby": labelledBy,
  "aria-valuetext": ariaValueText,
  animated,
  children,
  defaultLabel,
  duration,
  indeterminate,
  indeterminateText,
  max,
  min,
  rangeColor,
  striped,
  trackColor,
  value,
  valueText,
  rangeProps,
  ...props
}: ProgressProps) {
  const id = useId()
  const progress = useProgress<"div">({
    defaultLabel,
    indeterminate,
    indeterminateText,
    max,
    min,
    value,
    valueText: ariaValueText ?? valueText,
  })
  const [attributes, rest] = splitStyleProps("progress", progressStyle, {
    ...props,
    animated,
    striped,
  })
  const rootProps = progress.getRootProps()
  const width = `${progress.indeterminate ? 25 : progress.percent}%`

  return (
    <div
      {...rest}
      {...attributes}
      {...rootProps}
      className={`${attributes.className} ui-progress-paint`}
      style={
        duration === undefined
          ? rest.style
          : ({
              ...rest.style,
              "--progress-duration": feedbackValue(
                "animationDuration",
                duration,
                "s",
              ),
            } as CSSProperties)
      }
      aria-label={label ?? (labelledBy ? undefined : rootProps["aria-label"])}
      aria-labelledby={labelledBy}
    >
      <svg aria-hidden="true" focusable="false" height="100%" width="100%">
        {(striped || animated) && (
          <defs>
            <pattern
              id={id}
              height="12"
              patternUnits="userSpaceOnUse"
              width="12"
            >
              <path
                d="M0 12V7L7 0h5L0 12Zm12 0H7l5-5Z"
                fill="currentColor"
                opacity=".18"
              />
            </pattern>
          </defs>
        )}
        <rect
          fill={progressPaint(trackColor, "var(--progress-track)")}
          height="100%"
          width="100%"
        />
        <g
          className="ui-progress-fill"
          data-animate={progress.indeterminate || undefined}
        >
          <rect
            fill={progressPaint(rangeColor, "var(--progress-range)")}
            height="100%"
            width={width}
            {...rangeProps}
            className={["ui-progress-range", rangeProps?.className]
              .filter(Boolean)
              .join(" ")}
          />
          {(striped || animated) && (
            <svg height="100%" overflow="hidden" width={width}>
              <rect
                className="ui-progress-stripes"
                data-animate={
                  (animated && !progress.indeterminate) || undefined
                }
                fill={`url(#${id})`}
                height="100%"
                width="calc(100% + 12px)"
              />
            </svg>
          )}
        </g>
      </svg>
      {children}
    </div>
  )
}
