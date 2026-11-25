"use client"

import type { ComponentProps } from "react"
import { withDrawerContext } from "./drawer"

export const DrawerHeader = withDrawerContext("header", "header")()

export type DrawerHeaderProps = ComponentProps<typeof DrawerHeader>
