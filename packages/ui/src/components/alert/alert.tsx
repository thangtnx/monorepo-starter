import type { ComponentProps, ReactNode } from "react"
import type { ComponentStyleProps } from "../../core/define"
import type { ColorScheme } from "../../theme"
import type { AlertIconProps } from "./alert-icon"
import { Children, isValidElement } from "react"
import { splitStyleProps } from "../../core/split-style-props"
import { AlertIcon } from "./alert-icon"
import { alertStyle } from "./alert.style"

const statusSchemes = {
  danger: "danger",
  error: "danger",
  info: "info",
  success: "success",
  warning: "warning",
} satisfies { [status: string]: ColorScheme }

export type AlertStatus = keyof typeof statusSchemes
export type AlertStatusIcons = { [Status in AlertStatus]?: ReactNode }

const defaultStatusIcons: AlertStatusIcons = {}

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
  colorScheme = statusSchemes[status],
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
  const icon =
    iconProps?.children ?? statusIcons?.[status] ?? defaultStatusIcons[status]
  const showIcon =
    withIcon &&
    icon != null &&
    !Children.toArray(children).some(
      (child) => isValidElement(child) && child.type === AlertIcon,
    )
  return (
    <div
      {...rest}
      {...attributes}
      data-status={status}
      role={status === "error" || status === "danger" ? "alert" : "status"}
    >
      {showIcon && <AlertIcon {...iconProps}>{icon}</AlertIcon>}
      {children}
    </div>
  )
}
