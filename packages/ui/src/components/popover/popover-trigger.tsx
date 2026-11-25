"use client"

import type { ComponentProps, MouseEvent, ReactElement, Ref } from "react"
import { cloneElement, isValidElement } from "react"
import { mergeRefs } from "../../core/merge-props"
import { usePopoverContext } from "./popover"

interface TriggerElementProps {
  "aria-controls"?: string
  "aria-expanded"?: boolean
  "aria-haspopup"?: "dialog"
  ref?: Ref<HTMLElement>
  onClick?: (event: MouseEvent<HTMLElement>) => void
}

export interface PopoverTriggerProps extends Omit<
  ComponentProps<"button">,
  "children" | "type"
> {
  children?: ReactElement<TriggerElementProps> | string
}

/** Anchor element that toggles the popover when activated. */
export function PopoverTrigger({
  children,
  onClick,
  ...props
}: PopoverTriggerProps) {
  const context = usePopoverContext()

  const handleToggle = (
    event: MouseEvent<HTMLElement>,
    childOnClick?: (e: MouseEvent<HTMLElement>) => void,
  ) => {
    childOnClick?.(event)
    onClick?.(event as MouseEvent<HTMLButtonElement>)
    if (!event.defaultPrevented && context) context.setOpen(!context.open)
  }

  if (isValidElement<TriggerElementProps>(children)) {
    const childClick = children.props.onClick
    return cloneElement(children, {
      ref: mergeRefs(context?.triggerRef, children.props.ref),
      "aria-controls": context?.open ? context.contentId : undefined,
      "aria-expanded": context?.open ?? false,
      "aria-haspopup": "dialog",
      onClick: (event: MouseEvent<HTMLElement>) => {
        handleToggle(event, childClick)
      },
    })
  }

  return (
    <button
      ref={context?.triggerRef as Ref<HTMLButtonElement> | undefined}
      type="button"
      {...props}
      aria-controls={context?.open ? context.contentId : undefined}
      aria-expanded={context?.open ?? false}
      aria-haspopup="dialog"
      onClick={(event) => handleToggle(event)}
    >
      {children}
    </button>
  )
}
