"use client"

import type { ComponentProps } from "react"
import { useEffect } from "react"
import { useDrawerContext, withDrawerContext } from "./drawer"

export interface DrawerDescriptionProps extends ComponentProps<"p"> {}

const DescriptionSlot = withDrawerContext<"p", DrawerDescriptionProps>(
  "p",
  "description",
)()

/** Secondary description linked to the parent drawer via `aria-describedby`. */
export function DrawerDescription({ id, ...props }: DrawerDescriptionProps) {
  const context = useDrawerContext()
  const setHasDescription = context?.setHasDescription

  useEffect(() => {
    setHasDescription?.(true)
    return () => setHasDescription?.(false)
  }, [setHasDescription])

  return <DescriptionSlot {...props} id={id ?? context?.descriptionId} />
}
