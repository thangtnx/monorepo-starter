"use client"

import type { ComponentProps, MouseEvent } from "react"
import { Icon, X } from "../icon"
import { useDrawerContext, withDrawerContext } from "./drawer"
import { drawerDefaults } from "./drawer-config"

const CloseSlot = withDrawerContext<"button", ComponentProps<"button">>(
  "button",
  "close",
)()

export type DrawerCloseButtonProps = Omit<ComponentProps<"button">, "type">

/** Positioned button that closes the parent drawer. */
export function DrawerCloseButton({
  "aria-label": label,
  "aria-labelledby": labelledBy,
  children = <Icon as={X} />,
  onClick,
  ...props
}: DrawerCloseButtonProps) {
  const context = useDrawerContext()

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (!event.defaultPrevented) context?.setOpen(false)
  }

  return (
    <CloseSlot
      type="button"
      {...props}
      aria-label={label ?? (labelledBy ? undefined : drawerDefaults.closeLabel)}
      aria-labelledby={labelledBy}
      onClick={handleClick}
    >
      {children}
    </CloseSlot>
  )
}
