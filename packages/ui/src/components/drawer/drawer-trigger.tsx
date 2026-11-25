"use client"

import type { ComponentProps, MouseEvent, ReactElement } from "react"
import { cloneElement, isValidElement } from "react"
import { useDrawerContext } from "./drawer"

interface TriggerElementProps {
  "aria-controls"?: string
  "aria-expanded"?: boolean
  "aria-haspopup"?: "dialog"
  onClick?: (event: MouseEvent<HTMLElement>) => void
}

export interface DrawerTriggerProps extends Omit<
  ComponentProps<"button">,
  "children" | "type"
> {
  children?: ReactElement<TriggerElementProps> | string
}

/** Interactive trigger that opens the parent drawer. Clones a single child element to avoid nested buttons. */
export function DrawerTrigger({
  children,
  onClick,
  ...props
}: DrawerTriggerProps) {
  const context = useDrawerContext()

  const handleOpen = (
    event: MouseEvent<HTMLElement>,
    childOnClick?: (e: MouseEvent<HTMLElement>) => void,
  ) => {
    childOnClick?.(event)
    onClick?.(event as MouseEvent<HTMLButtonElement>)
    if (!event.defaultPrevented && context) {
      context.triggerRef.current = event.currentTarget
      context.setOpen(true)
    }
  }

  if (isValidElement<TriggerElementProps>(children)) {
    const childClick = children.props.onClick
    return cloneElement(children, {
      "aria-controls": context?.open ? context.contentId : undefined,
      "aria-expanded": context?.open ?? false,
      "aria-haspopup": "dialog",
      onClick: (event: MouseEvent<HTMLElement>) => {
        handleOpen(event, childClick)
      },
    })
  }

  return (
    <button
      type="button"
      {...props}
      aria-controls={context?.open ? context.contentId : undefined}
      aria-expanded={context?.open ?? false}
      aria-haspopup="dialog"
      onClick={(event) => handleOpen(event)}
    >
      {children}
    </button>
  )
}
