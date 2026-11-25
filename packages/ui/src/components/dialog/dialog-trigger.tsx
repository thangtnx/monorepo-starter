"use client"

import type { ComponentProps, MouseEvent, ReactElement } from "react"
import { cloneElement, isValidElement } from "react"
import { useDialogContext } from "./dialog"

interface TriggerElementProps {
  "aria-controls"?: string
  "aria-expanded"?: boolean
  "aria-haspopup"?: "dialog"
  onClick?: (event: MouseEvent<HTMLElement>) => void
}

export interface DialogTriggerProps extends Omit<
  ComponentProps<"button">,
  "children" | "type"
> {
  children?: ReactElement<TriggerElementProps> | string
}

/** Interactive trigger that opens the parent dialog. Clones a single child element to avoid nested buttons. */
export function DialogTrigger({
  children,
  onClick,
  ...props
}: DialogTriggerProps) {
  const context = useDialogContext()

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
