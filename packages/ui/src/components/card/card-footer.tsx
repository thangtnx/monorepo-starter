"use client"

import type { ComponentProps } from "react"
import { withCardContext } from "./card"

export interface CardFooterProps extends ComponentProps<"footer"> {}

export const CardFooter = withCardContext("footer", "footer")()
