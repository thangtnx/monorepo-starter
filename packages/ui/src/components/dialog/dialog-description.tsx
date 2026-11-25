"use client"

import type { ComponentProps } from "react"
import { useEffect } from "react"
import { useDialogContext, withDialogContext } from "./dialog"

export interface DialogDescriptionProps extends ComponentProps<"p"> {}

const DescriptionSlot = withDialogContext<"p", DialogDescriptionProps>(
  "p",
  "description",
)()

/** Secondary description linked to the parent dialog via `aria-describedby`. */
export function DialogDescription({ id, ...props }: DialogDescriptionProps) {
  const context = useDialogContext()
  const setHasDescription = context?.setHasDescription

  useEffect(() => {
    setHasDescription?.(true)
    return () => setHasDescription?.(false)
  }, [setHasDescription])

  return <DescriptionSlot {...props} id={id ?? context?.descriptionId} />
}
