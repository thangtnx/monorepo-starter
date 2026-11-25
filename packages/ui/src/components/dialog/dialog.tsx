"use client"

import type { ComponentProps, ReactNode } from "react"
import type { ThemeProps } from "../../core/define"
import type { DialogStyle } from "./dialog.style"
import type { DialogContextValue, UseDialogOptions } from "./use-dialog"
import { useMemo } from "react"
import { createSlotComponent } from "../../core/create-component"
import { dialogStyle } from "./dialog.style"
import { useDialog } from "./use-dialog"

const {
  ComponentContext,
  PropsContext,
  useComponentContext,
  withContext,
  withProvider,
} = createSlotComponent<
  ComponentProps<"dialog">,
  DialogStyle,
  DialogContextValue
>("dialog", dialogStyle)

export {
  ComponentContext as DialogContext,
  useComponentContext as useDialogContext,
  withContext as withDialogContext,
  withProvider as withDialogProvider,
}

export interface DialogRootProps
  extends UseDialogOptions, ThemeProps<DialogStyle> {
  children?: ReactNode
}

/** Coordinates open state, accessible labels, focus management, and shared style props for a dialog. */
export function DialogRoot({
  size,
  blockScrollOnMount,
  children,
  closeOnEsc,
  closeOnOverlayClick,
  defaultOpen,
  finalFocusRef,
  initialFocusRef,
  open,
  placement,
  onOpenChange,
}: DialogRootProps) {
  const context = useDialog({
    blockScrollOnMount,
    closeOnEsc,
    closeOnOverlayClick,
    defaultOpen,
    finalFocusRef,
    initialFocusRef,
    open,
    onOpenChange,
  })
  const styleProps = useMemo(() => ({ size, placement }), [placement, size])

  return (
    <PropsContext value={styleProps}>
      <ComponentContext value={context}>{children}</ComponentContext>
    </PropsContext>
  )
}
