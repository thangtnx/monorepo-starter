"use client"

import type { ComponentProps, MouseEvent } from "react"
import { Icon, X } from "../icon"
import { useDialogContext, withDialogContext } from "./dialog"
import { dialogDefaults } from "./dialog-config"

const CloseSlot = withDialogContext<"button", ComponentProps<"button">>(
  "button",
  "close",
)()

export type DialogCloseButtonProps = Omit<ComponentProps<"button">, "type">

/** Positioned button that closes the parent dialog. */
export function DialogCloseButton({
  "aria-label": label,
  "aria-labelledby": labelledBy,
  children = <Icon as={X} />,
  onClick,
  ...props
}: DialogCloseButtonProps) {
  const context = useDialogContext()

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (!event.defaultPrevented) context?.setOpen(false)
  }

  return (
    <CloseSlot
      type="button"
      {...props}
      aria-label={label ?? (labelledBy ? undefined : dialogDefaults.closeLabel)}
      aria-labelledby={labelledBy}
      onClick={handleClick}
    >
      {children}
    </CloseSlot>
  )
}
