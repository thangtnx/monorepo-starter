"use client"

import type { ComponentProps } from "react"
import { withCardContext } from "./card"

export interface CardBodyProps extends ComponentProps<"div"> {}

export const CardBody = withCardContext("div", "body")()
