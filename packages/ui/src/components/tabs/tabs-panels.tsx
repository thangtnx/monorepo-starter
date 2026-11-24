"use client"

import type { ComponentProps } from "react"
import { withTabsContext } from "./tabs"

export interface TabsPanelsProps extends ComponentProps<"div"> {}

export const TabsPanels = withTabsContext("div", "panels")()
