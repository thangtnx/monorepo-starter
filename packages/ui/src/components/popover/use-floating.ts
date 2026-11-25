"use client"

import type { RefObject } from "react"
import { useLayoutEffect } from "react"

export type FloatingPlacement =
  | "bottom"
  | "bottom-end"
  | "bottom-start"
  | "left"
  | "right"
  | "top"
  | "top-end"
  | "top-start"

export interface UseFloatingOptions {
  open: boolean
  panelRef: RefObject<HTMLElement | null>
  triggerRef: RefObject<HTMLElement | null>
  closeOnBlur?: boolean
  closeOnEsc?: boolean
  gutter?: number
  placement?: FloatingPlacement
  restoreFocusOnEsc?: boolean
  onClose?: () => void
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max))
}

function resolvePlacement(
  triggerRect: DOMRect,
  panelWidth: number,
  panelHeight: number,
  viewportWidth: number,
  viewportHeight: number,
  placement: FloatingPlacement,
  gutter: number,
  padding: number,
): FloatingPlacement {
  if (
    placement.startsWith("bottom") &&
    triggerRect.bottom + gutter + panelHeight > viewportHeight - padding &&
    triggerRect.top - gutter - panelHeight >= padding
  )
    return placement.replace("bottom", "top") as FloatingPlacement

  if (
    placement.startsWith("top") &&
    triggerRect.top - gutter - panelHeight < padding &&
    triggerRect.bottom + gutter + panelHeight <= viewportHeight - padding
  )
    return placement.replace("top", "bottom") as FloatingPlacement

  if (
    placement === "right" &&
    triggerRect.right + gutter + panelWidth > viewportWidth - padding &&
    triggerRect.left - gutter - panelWidth >= padding
  )
    return "left"

  if (
    placement === "left" &&
    triggerRect.left - gutter - panelWidth < padding &&
    triggerRect.right + gutter + panelWidth <= viewportWidth - padding
  )
    return "right"

  return placement
}

function syncPopover(panel: HTMLElement, visible: boolean) {
  if (typeof panel.showPopover !== "function") {
    // jsdom applies `[popover]:not(:popover-open) { display: none }` without implementing showPopover().
    if (visible) panel.style.display = "block"
    else panel.style.removeProperty("display")
    return
  }

  try {
    if (visible && !panel.matches(":popover-open")) panel.showPopover()
    else if (!visible && panel.matches(":popover-open")) panel.hidePopover()
  } catch {
    // Ignore when element is disconnected or already in the requested state.
  }
}

export function placeFloatingPanel(
  trigger: HTMLElement,
  panel: HTMLElement,
  placement: FloatingPlacement,
  gutter: number,
) {
  const doc = trigger.ownerDocument
  const padding = 8
  const triggerRect = trigger.getBoundingClientRect()
  const panelWidth = panel.offsetWidth || panel.getBoundingClientRect().width
  const panelHeight = panel.offsetHeight || panel.getBoundingClientRect().height
  const viewportWidth = doc.documentElement.clientWidth
  const viewportHeight = doc.documentElement.clientHeight

  const resolved = resolvePlacement(
    triggerRect,
    panelWidth,
    panelHeight,
    viewportWidth,
    viewportHeight,
    placement,
    gutter,
    padding,
  )

  let x = triggerRect.left
  let y = triggerRect.bottom + gutter

  if (resolved === "left") {
    x = triggerRect.left - panelWidth - gutter
    y = triggerRect.top + (triggerRect.height - panelHeight) / 2
  } else if (resolved === "right") {
    x = triggerRect.right + gutter
    y = triggerRect.top + (triggerRect.height - panelHeight) / 2
  } else {
    y = resolved.startsWith("top")
      ? triggerRect.top - panelHeight - gutter
      : triggerRect.bottom + gutter

    if (resolved.endsWith("-start")) x = triggerRect.left
    else if (resolved.endsWith("-end")) x = triggerRect.right - panelWidth
    else x = triggerRect.left + (triggerRect.width - panelWidth) / 2
  }

  panel.dataset.placement = resolved
  panel.style.setProperty(
    "--floating-x",
    `${Math.round(clamp(x, padding, viewportWidth - panelWidth - padding))}px`,
  )
  panel.style.setProperty(
    "--floating-y",
    `${Math.round(clamp(y, padding, viewportHeight - panelHeight - padding))}px`,
  )
}

export function useFloating({
  closeOnBlur = true,
  closeOnEsc = true,
  gutter = 6,
  open,
  panelRef,
  placement = "bottom",
  restoreFocusOnEsc = true,
  triggerRef,
  onClose,
}: UseFloatingOptions) {
  useLayoutEffect(() => {
    const trigger = triggerRef.current
    const panel = panelRef.current
    if (!open || !trigger || !panel) return

    syncPopover(panel, true)

    const doc = trigger.ownerDocument
    const view = doc.defaultView
    const position = () => placeFloatingPanel(trigger, panel, placement, gutter)
    position()

    const observer =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(position)
    observer?.observe(trigger)
    observer?.observe(panel)

    const onPointerDown = (event: PointerEvent) => {
      if (!closeOnBlur || !onClose) return
      const path = event.composedPath()
      if (!path.includes(trigger) && !path.includes(panel)) onClose()
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (!closeOnEsc || !onClose || event.key !== "Escape") return
      event.preventDefault()
      event.stopPropagation()
      onClose()
      if (restoreFocusOnEsc && trigger.isConnected) trigger.focus()
    }

    if (closeOnBlur) doc.addEventListener("pointerdown", onPointerDown, true)
    if (closeOnEsc) doc.addEventListener("keydown", onKeyDown, true)
    view?.addEventListener("resize", position)
    view?.addEventListener("scroll", position, true)

    return () => {
      observer?.disconnect()
      doc.removeEventListener("pointerdown", onPointerDown, true)
      doc.removeEventListener("keydown", onKeyDown, true)
      view?.removeEventListener("resize", position)
      view?.removeEventListener("scroll", position, true)
      syncPopover(panel, false)
    }
  }, [
    closeOnBlur,
    closeOnEsc,
    gutter,
    open,
    panelRef,
    placement,
    restoreFocusOnEsc,
    triggerRef,
    onClose,
  ])

  useLayoutEffect(() => {
    const trigger = triggerRef.current
    const panel = panelRef.current
    if (open && trigger && panel)
      placeFloatingPanel(trigger, panel, placement, gutter)
  })
}
