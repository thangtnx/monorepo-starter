"use client"

import type { ComponentProps } from "react"
import type { IconProps } from "../icon"
import { use } from "react"
import { splitStyleProps } from "../../core/split-style-props"
import { Icon } from "../icon"
import { IconSpinner } from "../icon/icon-spinner"
import { alertIconStyle } from "./alert-icon.style"
import { AlertStatusContext, alertStatuses } from "./alert-status"

export interface AlertIconProps extends ComponentProps<"span"> {
  /** Override the SVG icon for the current status. */
  as?: IconProps["as"]
}

export function AlertIcon({
  as,
  "aria-hidden": hidden,
  "aria-label": label,
  "aria-labelledby": labelledBy,
  children,
  role,
  ...props
}: AlertIconProps) {
  const { status, statusIcons } = use(AlertStatusContext)
  const defaults = alertStatuses[status]
  const customIcon = children ?? (as ? undefined : statusIcons?.[status])
  const Component = as ?? defaults.icon
  const accessibleLabel =
    label ?? (labelledBy || customIcon != null ? undefined : defaults.label)
  const labelled = Boolean(accessibleLabel || labelledBy)
  const [attributes, rest] = splitStyleProps(
    "alert-icon",
    alertIconStyle,
    props,
  )
  return (
    <span
      {...attributes}
      {...rest}
      aria-hidden={
        hidden ?? (customIcon == null && !labelled ? true : undefined)
      }
      aria-label={accessibleLabel}
      aria-labelledby={labelledBy}
      role={
        hidden === true ? undefined : (role ?? (labelled ? "img" : undefined))
      }
    >
      {customIcon ??
        (Component ? <Icon as={Component} /> : <IconSpinner decorative />)}
    </span>
  )
}
