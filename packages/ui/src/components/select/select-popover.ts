"use client"

import type { RefObject } from "react"
import { useLayoutEffect } from "react"

export function useSelectPopover(
  open: boolean,
  triggerRef: RefObject<HTMLButtonElement | null>,
  panelRef: RefObject<HTMLDivElement | null>,
  activeId: string | undefined,
  close: () => void,
) {
  useLayoutEffect(() => {
    const trigger = triggerRef.current
    const panel = panelRef.current
    if (!open || !trigger || !panel) return

    if (typeof panel.showPopover === "function") panel.showPopover()

    const document = trigger.ownerDocument
    const view = document.defaultView
    const dismissOutside = (event: PointerEvent) => {
      const path = event.composedPath()
      if (!path.includes(trigger) && !path.includes(panel)) close()
    }

    const position = () => placePanel(trigger, panel)
    const observer =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(position)
    observer?.observe(trigger)
    if (panel.firstElementChild) observer?.observe(panel.firstElementChild)
    document.addEventListener("pointerdown", dismissOutside, true)
    view?.addEventListener("resize", position)
    view?.addEventListener("scroll", position, true)

    return () => {
      observer?.disconnect()
      document.removeEventListener("pointerdown", dismissOutside, true)
      view?.removeEventListener("resize", position)
      view?.removeEventListener("scroll", position, true)
      if (typeof panel.hidePopover === "function") panel.hidePopover()
    }
  }, [close, open, panelRef, triggerRef])

  useLayoutEffect(() => {
    const trigger = triggerRef.current
    const panel = panelRef.current
    if (open && trigger && panel) placePanel(trigger, panel)
  })

  useLayoutEffect(() => {
    if (!open || activeId === undefined) return
    const option = panelRef.current?.ownerDocument.getElementById(activeId)
    if (typeof option?.scrollIntoView === "function")
      option.scrollIntoView({ block: "nearest", inline: "nearest" })
  }, [activeId, open, panelRef])
}

function placePanel(trigger: HTMLButtonElement, panel: HTMLDivElement) {
  const { ownerDocument } = trigger
  const view = ownerDocument.defaultView
  if (!view) return

  const { bottom, left, top, width } = trigger.getBoundingClientRect()
  const viewportHeight = ownerDocument.documentElement.clientHeight
  const below = viewportHeight - bottom

  panel.style.setProperty("--select-left", `${left}px`)
  panel.style.setProperty("--select-width", `${width}px`)

  const style = view.getComputedStyle(panel)
  // Measure the contents independently of the current scrolling height.
  const borders =
    (parseFloat(style.borderTopWidth) || 0) +
    (parseFloat(style.borderBottomWidth) || 0)
  const content =
    (panel.firstElementChild?.getBoundingClientRect().height ?? 0) + borders
  const gap = parseFloat(style.marginTop) || parseFloat(style.marginBottom) || 0
  const limit = parseFloat(style.maxHeight) || Infinity
  const above = top > below && below < Math.min(content, limit) + gap
  const room = Math.max(0, (above ? top : below) - gap)

  panel.dataset.placement = above ? "above" : "below"
  panel.style.setProperty("--select-top", `${bottom}px`)
  panel.style.setProperty("--select-bottom", `${viewportHeight - top}px`)
  panel.style.setProperty("--select-height", `${Math.min(content, room)}px`)
}
