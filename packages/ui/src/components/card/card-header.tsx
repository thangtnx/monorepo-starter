"use client"

import type { ComponentProps } from "react"
import { withCardContext } from "./card"

export interface CardHeaderProps extends ComponentProps<"header"> {}

export const CardHeader = withCardContext("header", "header")()
