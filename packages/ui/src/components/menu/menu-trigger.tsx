"use client"

import type {
  ComponentProps,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
  Ref,
} from "react"
import { cloneElement, isValidElement } from "react"
import { mergeRefs } from "../../core/merge-props"
import { useMenuContext } from "./menu"

interface TriggerElementProps {
  "aria-controls"?: string
  "aria-expanded"?: boolean
  "aria-haspopup"?: "menu"
  id?: string
  ref?: Ref<HTMLElement>
  onClick?: (event: MouseEvent<HTMLElement>) => void
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void
}

export interface MenuTriggerProps extends Omit<
  ComponentProps<"button">,
  "children" | "type"
> {
  children?: ReactElement<TriggerElementProps> | string
}

/** Button that opens or closes the menu via pointer or keyboard keys. */
export function MenuTrigger({
  id,
  children,
  onClick,
  onKeyDown,
  ...props
}: MenuTriggerProps) {
  const context = useMenuContext()

  const handleClick = (
    event: MouseEvent<HTMLElement>,
    childOnClick?: (e: MouseEvent<HTMLElement>) => void,
  ) => {
    childOnClick?.(event)
    onClick?.(event as MouseEvent<HTMLButtonElement>)
    if (!event.defaultPrevented && context)
      context.setOpen(!context.open, "trigger")
  }

  const handleKeyDown = (
    event: KeyboardEvent<HTMLElement>,
    childOnKeyDown?: (e: KeyboardEvent<HTMLElement>) => void,
  ) => {
    childOnKeyDown?.(event)
    onKeyDown?.(event as KeyboardEvent<HTMLButtonElement>)
    if (event.defaultPrevented || !context) return

    if (event.key === "ArrowDown") {
      event.preventDefault()
      context.setOpen(true, "first")
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      context.setOpen(true, "last")
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      context.setOpen(!context.open, "first")
    }
  }

  if (isValidElement<TriggerElementProps>(children)) {
    const childClick = children.props.onClick
    const childKeyDown = children.props.onKeyDown
    return cloneElement(children, {
      id: children.props.id ?? id ?? context?.triggerId,
      ref: mergeRefs(context?.triggerRef, children.props.ref),
      "aria-controls": context?.open ? context.contentId : undefined,
      "aria-expanded": context?.open ?? false,
      "aria-haspopup": "menu",
      onClick: (event: MouseEvent<HTMLElement>) => {
        handleClick(event, childClick)
      },
      onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
        handleKeyDown(event, childKeyDown)
      },
    })
  }

  return (
    <button
      id={id ?? context?.triggerId}
      ref={context?.triggerRef as Ref<HTMLButtonElement> | undefined}
      type="button"
      {...props}
      aria-controls={context?.open ? context.contentId : undefined}
      aria-expanded={context?.open ?? false}
      aria-haspopup="menu"
      onClick={(event) => handleClick(event)}
      onKeyDown={(event) => handleKeyDown(event)}
    >
      {children}
    </button>
  )
}
