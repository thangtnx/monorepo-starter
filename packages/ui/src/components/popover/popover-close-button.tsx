"use client"

import type { ComponentProps, MouseEvent } from "react"
import { Icon, X } from "../icon"
import { usePopoverContext, withPopoverContext } from "./popover"
import { popoverDefaults } from "./popover-config"

const CloseSlot = withPopoverContext<"button", ComponentProps<"button">>(
  "button",
  "close",
)()

export type PopoverCloseButtonProps = Omit<ComponentProps<"button">, "type">

/** Positioned button that dismisses the parent popover. */
export function PopoverCloseButton({
  "aria-label": label,
  "aria-labelledby": labelledBy,
  children = <Icon as={X} />,
  onClick,
  ...props
}: PopoverCloseButtonProps) {
  const context = usePopoverContext()

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (!event.defaultPrevented) context?.setOpen(false)
  }

  return (
    <CloseSlot
      type="button"
      {...props}
      aria-label={
        label ?? (labelledBy ? undefined : popoverDefaults.closeLabel)
      }
      aria-labelledby={labelledBy}
      onClick={handleClick}
    >
      {children}
    </CloseSlot>
  )
}
