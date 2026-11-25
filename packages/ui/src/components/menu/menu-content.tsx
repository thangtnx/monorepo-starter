"use client"

import type { ComponentProps, KeyboardEvent } from "react"
import { useCallback, useLayoutEffect } from "react"
import { mergeRefs } from "../../core/merge-props"
import { useFloating } from "../popover/use-floating"
import { useMenuContext, withMenuProvider } from "./menu"

const MenuSlot = withMenuProvider("div", "root")()

export type MenuContentProps = ComponentProps<typeof MenuSlot>

function getEnabledItems(menu: HTMLElement | null): HTMLElement[] {
  if (!menu) return []
  return Array.from(
    menu.querySelectorAll<HTMLElement>(
      '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]',
    ),
  ).filter(
    (item) =>
      !item.hasAttribute("disabled") &&
      item.getAttribute("aria-disabled") !== "true",
  )
}

/** Floating WAI-ARIA menu surface supporting roving keyboard navigation. */
export function MenuContent({
  id,
  ref,
  children,
  onKeyDown,
  ...props
}: MenuContentProps) {
  const context = useMenuContext()
  const open = context?.open ?? false
  const setOpen = context?.setOpen
  const handleClose = useCallback(() => setOpen?.(false), [setOpen])

  useFloating({
    closeOnBlur: context?.closeOnBlur ?? true,
    closeOnEsc: context?.closeOnEsc ?? true,
    gutter: context?.gutter ?? 6,
    open,
    panelRef: context?.panelRef ?? { current: null },
    placement: context?.placement ?? "bottom-start",
    triggerRef: context?.triggerRef ?? { current: null },
    onClose: handleClose,
  })

  useLayoutEffect(() => {
    const panel = context?.panelRef.current
    if (!open || !panel) return
    const items = getEnabledItems(panel)
    const intent = context.openIntentRef.current

    if (intent === "first") items[0]?.focus()
    else if (intent === "last") items[items.length - 1]?.focus()
    else panel.focus()
  }, [context, open])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return

    const panel = context?.panelRef.current
    if (event.key === "Tab") {
      setOpen?.(false)
      return
    }

    const items = getEnabledItems(panel ?? null)
    if (items.length === 0) return

    const active = panel?.ownerDocument.activeElement as HTMLElement | null
    const index = active ? items.indexOf(active) : -1

    if (event.key === "ArrowDown") {
      event.preventDefault()
      const next = index === -1 ? 0 : (index + 1) % items.length
      items[next]?.focus()
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      const prev =
        index === -1
          ? items.length - 1
          : (index - 1 + items.length) % items.length
      items[prev]?.focus()
    } else if (event.key === "Home") {
      event.preventDefault()
      items[0]?.focus()
    } else if (event.key === "End") {
      event.preventDefault()
      items[items.length - 1]?.focus()
    }
  }

  return (
    <MenuSlot
      role="menu"
      tabIndex={-1}
      {...props}
      id={id ?? context?.contentId}
      ref={mergeRefs(context?.panelRef, ref)}
      aria-labelledby={props["aria-labelledby"] ?? context?.triggerId}
      data-open={open || undefined}
      hidden={!open}
      popover="manual"
      onKeyDown={handleKeyDown}
    >
      {children}
    </MenuSlot>
  )
}
