"use client"

import type { ComponentProps } from "react"
import type { ComponentStyleProps } from "../../core/define"
import type { AlertIconProps } from "./alert-icon"
import type { AlertStatus, AlertStatusIcons } from "./alert-status"
import { Children, isValidElement } from "react"
import { splitStyleProps } from "../../core/split-style-props"
import { AlertIcon } from "./alert-icon"
import { AlertLoading } from "./alert-loading"
import { AlertStatusContext, alertStatuses } from "./alert-status"
import { alertStyle } from "./alert.style"

export type { AlertStatus, AlertStatusIcons } from "./alert-status"

export interface AlertRootProps
  extends
    Omit<ComponentProps<"div">, "color">,
    ComponentStyleProps<typeof alertStyle> {
  /** The status that controls the default color and announcement priority. @default "info" */
  status?: AlertStatus
  /** Override the icon slot for individual statuses. */
  statusIcons?: AlertStatusIcons
  /** Show the generated icon when the status has one. @default true */
  withIcon?: boolean
  /** Attributes and optional content of the generated icon. */
  iconProps?: AlertIconProps
}

export function AlertRoot({
  status = "info",
  colorScheme = alertStatuses[status].colorScheme,
  children,
  statusIcons,
  withIcon = true,
  iconProps,
  ...props
}: AlertRootProps) {
  const [attributes, rest] = splitStyleProps("alert", alertStyle, {
    ...props,
    colorScheme,
  })
  const showIcon =
    withIcon &&
    !Children.toArray(children).some(
      (child) =>
        isValidElement(child) &&
        (child.type === AlertIcon || child.type === AlertLoading),
    )
  return (
    <div
      {...rest}
      {...attributes}
      aria-busy={rest["aria-busy"] ?? (status === "loading" || undefined)}
      data-status={status}
      role={status === "error" || status === "danger" ? "alert" : "status"}
    >
      <AlertStatusContext value={{ status, statusIcons }}>
        {showIcon && <AlertIcon {...iconProps} />}
        {children}
      </AlertStatusContext>
    </div>
  )
}
