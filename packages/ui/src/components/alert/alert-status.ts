"use client"

import type { ReactNode } from "react"
import type { ColorScheme } from "../../theme"
import type { IconProps } from "../icon"
import { createContext } from "react"
import {
  CircleCheckBig,
  Info,
  OctagonAlert,
  TriangleAlert,
} from "../icon/icons"
import { loadingDefaults } from "../loading/loading-config"

export const alertStatuses = {
  danger: { colorScheme: "danger", icon: OctagonAlert, label: "Danger" },
  error: { colorScheme: "danger", icon: OctagonAlert, label: "Error" },
  info: { colorScheme: "info", icon: Info, label: "Information" },
  loading: {
    colorScheme: "info",
    icon: undefined,
    label: loadingDefaults.label,
  },
  success: { colorScheme: "success", icon: CircleCheckBig, label: "Success" },
  warning: { colorScheme: "warning", icon: TriangleAlert, label: "Warning" },
} satisfies {
  [status: string]: {
    colorScheme: ColorScheme
    icon: IconProps["as"]
    label: string
  }
}

export type AlertStatus = keyof typeof alertStatuses
export type AlertStatusIcons = { [Status in AlertStatus]?: ReactNode }

export const AlertStatusContext = createContext<{
  status: AlertStatus
  statusIcons?: AlertStatusIcons
}>({ status: "info" })
