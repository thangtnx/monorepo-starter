"use client"

import { createContext, useContext } from "react"

export type TabsOrientation = "horizontal" | "vertical"

export interface TabsContextValue {
  activeValue: string | undefined
  idPrefix: string
  keepMounted: boolean
  lazy: boolean
  loop: boolean
  manual: boolean
  orientation: TabsOrientation
  visited: ReadonlySet<string>
  registerFirstValue: (value: string) => void
  setValue: (value: string) => void
}

export const TabsContext = createContext<TabsContextValue | undefined>(
  undefined,
)

export function useTabsContext() {
  return useContext(TabsContext)
}
