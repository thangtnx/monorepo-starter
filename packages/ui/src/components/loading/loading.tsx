import type { ComponentProps } from "react"
import type { ComponentStyleProps } from "../../core/define"
import { splitStyleProps } from "../../core/split-style-props"
import { loadingDefaults } from "./loading-config"
import { loadingStyle } from "./loading.style"

export const loadingSchemes = [
  "audio",
  "circles",
  "dots",
  "grid",
  "oval",
  "puff",
  "rings",
] as const
export type LoadingScheme = (typeof loadingSchemes)[number]

export interface LoadingProps
  extends ComponentProps<"svg">, ComponentStyleProps<typeof loadingStyle> {
  /** Hide the indicator when a parent already communicates its loading state. @default false */
  decorative?: boolean
  /** Animation duration, as a number of seconds or a CSS time. */
  duration?: number | string
  /** Paint for the inactive elements of the indicator. @default "currentColor" */
  secondaryColor?: string
}

export interface LoadingIndicatorProps extends LoadingProps {
  /** The indicator to display. @default "oval" */
  scheme?: LoadingScheme
}

const dotPositions = [6, 12, 18]
const glyphs = {
  audio: () =>
    dotPositions.map((x) => (
      <path
        key={x}
        data-motion="beat"
        d={`M${x} 5v14`}
        strokeLinecap="round"
        strokeWidth="3"
      />
    )),
  circles: (secondary: string) =>
    dotPositions.map((x, index) => (
      <circle
        key={x}
        data-motion="beat"
        cx={x}
        cy={12 - (index % 2) * 5}
        fill={index === 1 ? secondary : "currentColor"}
        r="3"
        stroke="none"
      />
    )),
  dots: () =>
    dotPositions.map((x) => (
      <circle
        key={x}
        data-motion="beat"
        cx={x}
        cy="12"
        fill="currentColor"
        r="2"
        stroke="none"
      />
    )),
  grid: () =>
    dotPositions.flatMap((x) =>
      dotPositions.map((y) => (
        <rect
          key={`${x}-${y}`}
          data-motion="beat"
          fill="currentColor"
          height="4"
          rx="1"
          stroke="none"
          width="4"
          x={x - 2}
          y={y - 2}
        />
      )),
    ),
  oval: (secondary: string) => (
    <>
      <circle cx="12" cy="12" opacity=".25" r="9" stroke={secondary} />
      <path d="M12 3a9 9 0 0 1 9 9" strokeLinecap="round" />
    </>
  ),
  puff: (secondary: string) => (
    <>
      <circle cx="12" cy="12" opacity=".35" r="9" stroke={secondary} />
      <circle data-motion="puff" cx="12" cy="12" r="7" />
    </>
  ),
  rings: (secondary: string) => (
    <>
      <path d="M12 2a10 10 0 1 1-10 10" strokeLinecap="round" />
      <path d="M12 6a6 6 0 1 0 6 6" stroke={secondary} strokeLinecap="round" />
    </>
  ),
}

export function LoadingIndicator({
  "aria-label": label,
  "aria-labelledby": labelledBy,
  children,
  decorative = false,
  dur,
  duration = dur,
  role,
  scheme = "oval",
  secondaryColor = "currentColor",
  ...props
}: LoadingIndicatorProps) {
  const [attributes, rest] = splitStyleProps("loading", loadingStyle, props)
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      {...attributes}
      {...rest}
      aria-hidden={decorative ? true : rest["aria-hidden"]}
      aria-label={
        decorative || labelledBy ? label : (label ?? loadingDefaults.label)
      }
      aria-labelledby={labelledBy}
      data-duration={typeof duration === "number" ? `${duration}s` : duration}
      data-indicator={scheme}
      focusable="false"
      role={decorative ? undefined : (role ?? "img")}
    >
      <g
        data-motion={
          scheme === "oval" || scheme === "rings" ? "spin" : undefined
        }
      >
        {glyphs[scheme](secondaryColor)}
      </g>
      {children}
    </svg>
  )
}
