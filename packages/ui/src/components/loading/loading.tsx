"use client"

import type {
  ComponentProps,
  ComponentType,
  CSSProperties,
  ReactNode,
} from "react"
import type { ComponentStyleProps } from "../../core/define"
import { createContext, use } from "react"
import { splitStyleProps } from "../../core/split-style-props"
import { feedbackValue } from "./feedback-style"
import { loadingDefaults } from "./loading-config"
import { loadingStyle } from "./loading.style"

export interface LoadingProps
  extends ComponentProps<"svg">, ComponentStyleProps<typeof loadingStyle> {
  /** Hide the indicator when a parent communicates its loading state. @default false */
  decorative?: boolean
  /** Alias for duration. */
  dur?: number | string
  /** Animation duration as seconds, a CSS time, or a duration token. */
  duration?: number | string
  /** Paint for the inactive elements of the indicator. */
  secondaryColor?: string
}

export const LoadingPropsContext = createContext<LoadingProps>({})

export function useLoadingPropsContext() {
  return use(LoadingPropsContext)
}

interface MotionVariables extends CSSProperties {
  [property: `--loading-${string}`]: number | string
}

export function motionStyle(variables: MotionVariables): CSSProperties {
  return variables
}

interface LoadingDrawing {
  name: string
  viewBox: string
  as?: ComponentType<ComponentProps<"svg">>
  className?: string
  drawing?: ReactNode
  fill?: string
  motion?: CSSProperties
  stroke?: string
}

export function createLoading({
  as,
  name,
  className,
  drawing,
  motion,
  ...svg
}: LoadingDrawing) {
  const Component = as ?? "svg"
  function LoadingVariant(props: LoadingProps) {
    const defaults = useLoadingPropsContext()
    const customDuration =
      props.duration ?? props.dur ?? defaults.duration ?? defaults.dur
    const {
      className: _className,
      style,
      "aria-label": label,
      "aria-labelledby": labelledBy,
      children,
      decorative = false,
      dur: _dur,
      duration: _duration,
      role,
      secondaryColor,
      ...rest
    } = { ...defaults, ...props }
    const [attributes, element] = splitStyleProps("loading", loadingStyle, {
      ...rest,
      className: [
        `ui-loading-${name}`,
        className,
        defaults.className,
        props.className,
      ]
        .filter(Boolean)
        .join(" "),
    })
    const inlineStyle = {
      ...motion,
      ...defaults.style,
      ...style,
      ...(customDuration !== undefined
        ? {
            "--loading-duration": feedbackValue(
              "animationDuration",
              customDuration,
              "s",
            ),
          }
        : {}),
      ...(secondaryColor !== undefined
        ? {
            "--loading-secondary": feedbackValue("color", secondaryColor),
          }
        : {}),
    } as CSSProperties

    return (
      <Component
        height="1em"
        width="1em"
        {...svg}
        {...element}
        {...attributes}
        style={inlineStyle}
        aria-hidden={decorative ? true : element["aria-hidden"]}
        aria-label={
          label ??
          (decorative || labelledBy ? undefined : loadingDefaults.label)
        }
        aria-labelledby={labelledBy}
        focusable="false"
        role={decorative ? undefined : (role ?? "img")}
      >
        {drawing}
        {children}
      </Component>
    )
  }

  LoadingVariant.displayName = `Loading.${name}`
  return LoadingVariant
}
