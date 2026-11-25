"use client"

import type { ComponentProps } from "react"
import { withDrawerContext } from "./drawer"

export const DrawerBody = withDrawerContext("div", "body")()

export type DrawerBodyProps = ComponentProps<typeof DrawerBody>
