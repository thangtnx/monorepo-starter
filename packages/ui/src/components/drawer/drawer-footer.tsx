"use client"

import type { ComponentProps } from "react"
import { withDrawerContext } from "./drawer"

export const DrawerFooter = withDrawerContext("footer", "footer")()

export type DrawerFooterProps = ComponentProps<typeof DrawerFooter>
