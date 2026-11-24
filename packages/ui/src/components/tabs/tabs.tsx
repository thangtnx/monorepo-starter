"use client"

import type { ComponentProps } from "react"
import type { ThemeProps } from "../../core/define"
import type { TabsOrientation } from "./tabs-context"
import type { TabsStyle } from "./tabs.style"
import { useCallback, useEffect, useId, useState } from "react"
import { createSlotComponent } from "../../core/create-component"
import { TabsContext } from "./tabs-context"
import { tabsStyle } from "./tabs.style"

/**
 * Root container managing the active tab, keyboard options, and shared styles.
 *
 * @property align Defaults to `"start"`.
 * @property colorScheme Defaults to `"primary"`.
 * @property fitted Defaults to `false`.
 * @property orientation Defaults to `"horizontal"`.
 * @property size Defaults to `"md"`.
 * @property variant Defaults to `"line"`.
 */
export interface TabsRootProps
  extends
    Omit<ComponentProps<"div">, "color" | "defaultValue">,
    ThemeProps<TabsStyle> {
  /** Initial active tab value for an uncontrolled tabs instance. */
  defaultValue?: string
  /**
   * If `true`, inactive panels stay mounted in the DOM.
   *
   * @default true
   */
  keepMounted?: boolean
  /**
   * If `true`, panel content mounts only after the tab is first activated.
   *
   * @default false
   */
  lazy?: boolean
  /**
   * If `true`, arrow-key focus wraps from the last tab to the first and vice versa.
   *
   * @default true
   */
  loop?: boolean
  /**
   * If `true`, arrow keys move focus without activating the tab until Enter or Space.
   *
   * @default false
   */
  manual?: boolean
  /** Controlled active tab value. */
  value?: string
  /** Called when the active tab changes. */
  onValueChange?: (value: string) => void
}

const {
  PropsContext: TabsPropsContext,
  usePropsContext: useTabsPropsContext,
  withContext,
  withProvider,
} = createSlotComponent<
  Omit<
    TabsRootProps,
    | "defaultValue"
    | "keepMounted"
    | "lazy"
    | "loop"
    | "manual"
    | "onValueChange"
    | "value"
  >,
  TabsStyle
>("tabs", tabsStyle)

const TabsRootElement = withProvider("div", "root")()

export { TabsPropsContext, useTabsPropsContext, withContext as withTabsContext }

export function TabsRoot({
  id,
  children,
  defaultValue,
  keepMounted = true,
  lazy = false,
  loop = true,
  manual = false,
  value,
  onValueChange,
  ...props
}: TabsRootProps) {
  const propDefaults = useTabsPropsContext()
  const orientation: TabsOrientation =
    props.orientation ?? propDefaults?.orientation ?? "horizontal"
  const generatedId = useId()
  const idPrefix = id ?? generatedId
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const activeValue = value ?? uncontrolledValue
  const [visited, setVisited] = useState<Set<string>>(() =>
    activeValue === undefined ? new Set() : new Set([activeValue]),
  )

  useEffect(() => {
    if (activeValue === undefined) return
    setVisited((previous) =>
      previous.has(activeValue) ? previous : new Set(previous).add(activeValue),
    )
  }, [activeValue])

  const registerFirstValue = useCallback((candidate: string) => {
    setUncontrolledValue((current) => current ?? candidate)
  }, [])

  const setValue = useCallback(
    (next: string) => {
      if (value === undefined) setUncontrolledValue(next)
      onValueChange?.(next)
    },
    [onValueChange, value],
  )

  return (
    <TabsContext
      value={{
        activeValue,
        idPrefix,
        keepMounted,
        lazy,
        loop,
        manual,
        orientation,
        registerFirstValue,
        setValue,
        visited,
      }}
    >
      <TabsRootElement id={id} {...props}>
        {children}
      </TabsRootElement>
    </TabsContext>
  )
}
