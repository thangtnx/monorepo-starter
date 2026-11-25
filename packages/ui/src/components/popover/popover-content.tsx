"use client"

import type { ComponentProps } from "react"
import { useCallback } from "react"
import { mergeRefs } from "../../core/merge-props"
import { usePopoverContext, withPopoverProvider } from "./popover"
import { useFloating } from "./use-floating"

const PopoverSlot = withPopoverProvider("div", "root")()

export type PopoverContentProps = ComponentProps<typeof PopoverSlot>

/** Anchored Popover API surface containing popover sections. */
export function PopoverContent({
  id,
  ref,
  children,
  ...props
}: PopoverContentProps) {
  const context = usePopoverContext()
  const open = context?.open ?? false
  const setOpen = context?.setOpen
  const handleClose = useCallback(() => setOpen?.(false), [setOpen])

  useFloating({
    closeOnBlur: context?.closeOnBlur ?? true,
    closeOnEsc: context?.closeOnEsc ?? true,
    gutter: context?.gutter ?? 6,
    open,
    panelRef: context?.panelRef ?? { current: null },
    placement: context?.placement ?? "bottom",
    triggerRef: context?.triggerRef ?? { current: null },
    onClose: handleClose,
  })

  return (
    <PopoverSlot
      role="dialog"
      tabIndex={-1}
      {...props}
      id={id ?? context?.contentId}
      ref={mergeRefs(context?.panelRef, ref)}
      data-open={open || undefined}
      hidden={!open}
      popover="manual"
    >
      {children}
    </PopoverSlot>
  )
}
