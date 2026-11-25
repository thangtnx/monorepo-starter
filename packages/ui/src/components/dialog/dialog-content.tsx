"use client"

import type {
  ComponentProps,
  KeyboardEvent,
  MouseEvent,
  SyntheticEvent,
} from "react"
import { mergeRefs } from "../../core/merge-props"
import { slotClassName } from "../../core/style-attributes"
import { useDialogContext, withDialogProvider } from "./dialog"
import { useDialogEffect } from "./use-dialog"

const DialogSlot = withDialogProvider("dialog", "root")()

export type DialogContentProps = ComponentProps<typeof DialogSlot>

/** Top-layer native `<dialog>` surface containing the header, body, and footer slots. */
export function DialogContent({
  id,
  ref,
  children,
  onCancel,
  onClick,
  onKeyDown,
  ...props
}: DialogContentProps) {
  const context = useDialogContext()
  const mergedRef = mergeRefs(context?.dialogRef, ref)

  useDialogEffect({
    blockScrollOnMount: context?.blockScrollOnMount ?? false,
    dialogRef: context?.dialogRef ?? { current: null },
    finalFocusRef: context?.finalFocusRef,
    initialFocusRef: context?.initialFocusRef,
    open: context?.open ?? false,
    triggerRef: context?.triggerRef ?? { current: null },
  })

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    onCancel?.(event)
    const callerPrevented = event.defaultPrevented
    // Keep `<dialog>` open state synchronized with React instead of letting UA close imperatively.
    event.preventDefault()
    if (!callerPrevented && (context?.closeOnEsc ?? true))
      context?.setOpen(false)
  }

  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    onClick?.(event)
    if (
      !event.defaultPrevented &&
      (context?.closeOnOverlayClick ?? true) &&
      event.target === event.currentTarget
    )
      context?.setOpen(false)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    onKeyDown?.(event)
    if (
      !event.defaultPrevented &&
      event.key === "Escape" &&
      (context?.closeOnEsc ?? true) &&
      typeof context?.dialogRef.current?.showModal !== "function"
    ) {
      event.stopPropagation()
      context?.setOpen(false)
    }
  }

  return (
    <DialogSlot
      {...props}
      id={id ?? context?.contentId}
      ref={mergedRef}
      aria-describedby={
        props["aria-describedby"] ??
        (context?.hasDescription ? context.descriptionId : undefined)
      }
      aria-labelledby={
        props["aria-labelledby"] ??
        (context?.hasTitle ? context.titleId : undefined)
      }
      tabIndex={-1}
      onCancel={handleCancel}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className={slotClassName("dialog", "container")}>{children}</div>
    </DialogSlot>
  )
}
