"use client"

import type { ComponentProps } from "react"
import { useEffect } from "react"
import { useDrawerContext, withDrawerContext } from "./drawer"

export interface DrawerTitleProps extends ComponentProps<"h2"> {}

const TitleSlot = withDrawerContext<"h2", DrawerTitleProps>("h2", "title")()

/** Accessible heading linked to the parent drawer via `aria-labelledby`. */
export function DrawerTitle({ id, ...props }: DrawerTitleProps) {
  const context = useDrawerContext()
  const setHasTitle = context?.setHasTitle

  useEffect(() => {
    setHasTitle?.(true)
    return () => setHasTitle?.(false)
  }, [setHasTitle])

  return <TitleSlot {...props} id={id ?? context?.titleId} />
}
