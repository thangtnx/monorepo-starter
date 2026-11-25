"use client"

import type { ComponentProps, ReactNode } from "react"
import type { ThemeProps } from "../../core/define"
import type { DialogContextValue, UseDialogOptions } from "../dialog/use-dialog"
import type { DrawerStyle } from "./drawer.style"
import { useMemo } from "react"
import { createSlotComponent } from "../../core/create-component"
import { useDialog } from "../dialog/use-dialog"
import { drawerStyle } from "./drawer.style"

const {
  ComponentContext,
  PropsContext,
  useComponentContext,
  withContext,
  withProvider,
} = createSlotComponent<
  ComponentProps<"dialog">,
  DrawerStyle,
  DialogContextValue
>("drawer", drawerStyle)

export {
  ComponentContext as DrawerContext,
  useComponentContext as useDrawerContext,
  withContext as withDrawerContext,
  withProvider as withDrawerProvider,
}

export interface DrawerRootProps
  extends UseDialogOptions, ThemeProps<DrawerStyle> {
  children?: ReactNode
}

/** Coordinates open state, placement, sizing, and focus lifecycle for a sliding drawer panel. */
export function DrawerRoot({
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
}: DrawerRootProps) {
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
