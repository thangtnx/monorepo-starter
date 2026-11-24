// cspell:words valuenow valuetext
import type { ComponentProps } from "react"
import { colorSchemeVar, toVarName } from "../../core/tokens"
import { progressDefaults } from "./progress-config"

export interface UseProgressProps {
  /** Name used when no ARIA label is supplied. */
  defaultLabel?: string
  /** Explicitly mark progress as indeterminate. @default false */
  indeterminate?: boolean
  /** Value text used while progress is indeterminate. */
  indeterminateText?: string
  /** Maximum value. @default 100 */
  max?: number
  /** Minimum value. @default 0 */
  min?: number
  /** Current value, or null for indeterminate progress. @default 0 */
  value?: null | number
  /** Text alternative to the numeric value, or a formatter for the clamped value. */
  valueText?: ((value: number, min: number, max: number) => string) | string
}

export function useProgress<Root extends "div" | "svg" = "div">({
  defaultLabel = progressDefaults.label,
  indeterminate = false,
  indeterminateText = progressDefaults.indeterminateText,
  max = 100,
  min = 0,
  value = 0,
  valueText,
}: UseProgressProps = {}) {
  const minimum = Number.isFinite(min) ? min : 0
  const maximum =
    Number.isFinite(max) && max > minimum ? max : Math.max(100, minimum)
  const current =
    value == null || indeterminate || !Number.isFinite(value)
      ? undefined
      : Math.min(maximum, Math.max(minimum, value))
  const span = maximum - minimum
  const percent =
    current === undefined || span === 0 ? 0 : ((current - minimum) / span) * 100
  const isIndeterminate = current === undefined
  type Part = Root extends "svg" ? "circle" : "div"

  const rootProps = {
    "aria-label": defaultLabel,
    "aria-valuemax": maximum,
    "aria-valuemin": minimum,
    "aria-valuenow": current,
    "aria-valuetext":
      typeof valueText === "function" && current !== undefined
        ? valueText(current, minimum, maximum)
        : typeof valueText === "string"
          ? valueText
          : isIndeterminate
            ? indeterminateText
            : undefined,
    "data-indeterminate": isIndeterminate,
    role: "progressbar",
  } as const

  function getRootProps(): typeof rootProps
  function getRootProps<Extra extends ComponentProps<Root>>(
    props: Extra,
  ): Extra & Omit<typeof rootProps, keyof Extra>
  function getRootProps(props?: ComponentProps<Root>) {
    return { ...rootProps, ...props }
  }

  function getPartProps(props?: ComponentProps<Part>) {
    return { "data-indeterminate": isIndeterminate, ...props }
  }

  return {
    indeterminate: isIndeterminate,
    percent,
    getRangeProps: getPartProps,
    getRootProps,
    getTrackProps: getPartProps,
  }
}

export type UseProgressReturn = ReturnType<typeof useProgress>

export function progressPaint(color: string | undefined, fallback: string) {
  if (!color) return fallback
  if (!/^[a-z][\w-]*(\.[\w-]+)*$/i.test(color)) return color
  const path = color.split(".")
  const role = path[1]
  const token =
    path[0] === "colorScheme" && path.length === 2 && role
      ? colorSchemeVar(role)
      : toVarName("colors", path)
  return `var(${token}, ${path.length === 1 ? color : fallback})`
}
