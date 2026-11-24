"use client"

import type { ComponentProps } from "react"
import { withTabsContext } from "./tabs"
import { useTabsContext } from "./tabs-context"

export interface TabsListProps extends ComponentProps<"div"> {}

const TabsListElement = withTabsContext("div", "list")()

export function TabsList(props: TabsListProps) {
  const context = useTabsContext()

  return (
    <TabsListElement
      aria-orientation={context?.orientation ?? "horizontal"}
      role="tablist"
      {...props}
    />
  )
}
