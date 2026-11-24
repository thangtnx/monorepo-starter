"use client"

import type { ComponentProps, KeyboardEvent, MouseEvent } from "react"
import { useEffect } from "react"
import { withTabsContext } from "./tabs"
import { useTabsContext } from "./tabs-context"

export interface TabsTabProps extends Omit<ComponentProps<"button">, "value"> {
  /** Unique value linking this tab to its matching panel. */
  value: string
  /**
   * If `true`, the tab cannot be focused or activated.
   *
   * @default false
   */
  disabled?: boolean
}

const TabsTabElement = withTabsContext("button", "tab")()

export function TabsTab({
  disabled = false,
  value,
  onClick,
  onKeyDown,
  ...props
}: TabsTabProps) {
  const context = useTabsContext()
  const isSelected = context?.activeValue === value
  const orientation = context?.orientation ?? "horizontal"
  const registerFirstValue = context?.registerFirstValue

  useEffect(() => {
    if (!disabled) registerFirstValue?.(value)
  }, [disabled, registerFirstValue, value])

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    onClick?.(event)
    if (!event.defaultPrevented && !disabled) context?.setValue(value)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    onKeyDown?.(event)
    if (event.defaultPrevented || !context || disabled) return

    const nextKey = orientation === "horizontal" ? "ArrowRight" : "ArrowDown"
    const previousKey = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp"
    if (
      event.key !== nextKey &&
      event.key !== previousKey &&
      event.key !== "Home" &&
      event.key !== "End"
    )
      return

    const list = event.currentTarget.closest('[role="tablist"]')
    if (!list) return

    const tabs = Array.from(
      list.querySelectorAll<HTMLButtonElement>(
        '[role="tab"]:not(:disabled):not([aria-disabled="true"])',
      ),
    )
    const currentIndex = tabs.indexOf(event.currentTarget)
    if (currentIndex === -1 || tabs.length === 0) return

    let targetIndex = currentIndex
    if (event.key === "Home") targetIndex = 0
    else if (event.key === "End") targetIndex = tabs.length - 1
    else if (event.key === nextKey)
      targetIndex =
        currentIndex + 1 < tabs.length
          ? currentIndex + 1
          : context.loop
            ? 0
            : currentIndex
    else if (event.key === previousKey)
      targetIndex =
        currentIndex - 1 >= 0
          ? currentIndex - 1
          : context.loop
            ? tabs.length - 1
            : currentIndex

    const target = tabs[targetIndex]
    if (!target) return

    event.preventDefault()
    target.focus()
    const targetValue = target.dataset.value
    if (!context.manual && targetValue !== undefined)
      context.setValue(targetValue)
  }

  return (
    <TabsTabElement
      id={context ? `${context.idPrefix}-tab-${value}` : undefined}
      type="button"
      aria-controls={context ? `${context.idPrefix}-panel-${value}` : undefined}
      aria-selected={isSelected}
      data-value={value}
      disabled={disabled}
      role="tab"
      tabIndex={isSelected ? 0 : -1}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    />
  )
}
