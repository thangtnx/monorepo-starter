"use client"

import type { ComponentProps } from "react"
import { useEffect } from "react"
import { useDialogContext, withDialogContext } from "./dialog"

export interface DialogTitleProps extends ComponentProps<"h2"> {}

const TitleSlot = withDialogContext<"h2", DialogTitleProps>("h2", "title")()

/** Accessible heading linked to the parent dialog via `aria-labelledby`. */
export function DialogTitle({ id, ...props }: DialogTitleProps) {
  const context = useDialogContext()
  const setHasTitle = context?.setHasTitle

  useEffect(() => {
    setHasTitle?.(true)
    return () => setHasTitle?.(false)
  }, [setHasTitle])

  return <TitleSlot {...props} id={id ?? context?.titleId} />
}
