import type { ComponentProps, ComponentType } from "react"
import { splitStyleProps } from "../../core/split-style-props"
import { resolveFeedbackToken } from "../loading/feedback-style"
import { iconStyle } from "./icon.style"

export interface IconProps extends Omit<ComponentProps<"svg">, "size"> {
  /** The SVG component to render. Defaults to an SVG for custom children. */
  as?: ComponentType<ComponentProps<"svg">>
  /** Stroke color as a theme token or CSS color. @default "currentColor" */
  color?: string
  /** Width and height as a theme token, CSS length, or number of pixels. @default "1em" */
  size?: number | string
}

export function Icon({
  as,
  size = "1em",
  "aria-hidden": hidden,
  "aria-label": label,
  "aria-labelledby": labelledBy,
  color = "currentColor",
  height,
  role,
  width,
  ...props
}: IconProps) {
  const Component = as ?? "svg"
  const dimension =
    typeof size === "number" ? size : resolveFeedbackToken("width", size)
  const labelled = Boolean(label?.trim() || labelledBy?.trim())
  const [attributes, element] = splitStyleProps("icon", iconStyle, props)

  return (
    <Component
      color={resolveFeedbackToken("color", color)}
      fill={as ? "none" : "currentColor"}
      height={height ?? dimension}
      width={width ?? dimension}
      {...element}
      {...attributes}
      aria-hidden={hidden ?? (!labelled || undefined)}
      aria-label={label}
      aria-labelledby={labelledBy}
      data-icon=""
      focusable="false"
      role={
        hidden === true ? undefined : (role ?? (labelled ? "img" : undefined))
      }
    />
  )
}
