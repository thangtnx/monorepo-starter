"use client"

import type { ComponentProps } from "react"
import { withTabsContext } from "./tabs"
import { useTabsContext } from "./tabs-context"

export interface TabsPanelProps extends ComponentProps<"div"> {
  /** Unique value matching the controlling tab. */
  value: string
}

const TabsPanelElement = withTabsContext("div", "panel")()

export function TabsPanel({ children, value, ...props }: TabsPanelProps) {
  const context = useTabsContext()
  const isSelected = context?.activeValue === value
  const keepMounted = context?.keepMounted ?? true
  const shouldMount =
    isSelected ||
    (keepMounted && (!context?.lazy || Boolean(context.visited.has(value))))

  return (
    <TabsPanelElement
      id={context ? `${context.idPrefix}-panel-${value}` : undefined}
      aria-labelledby={context ? `${context.idPrefix}-tab-${value}` : undefined}
      hidden={!isSelected}
      role="tabpanel"
      tabIndex={0}
      {...props}
    >
      {shouldMount ? children : null}
    </TabsPanelElement>
  )
}
