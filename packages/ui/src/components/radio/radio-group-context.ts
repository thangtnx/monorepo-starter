"use client"

import type { ComponentStyleProps } from "../../core/define"
import type { radioStyle } from "./radio.style"
import { createContext } from "react"

interface RadioGroupContextValue {
  name: string
  invalid?: boolean
  readOnly?: boolean
  required?: boolean
  size?: ComponentStyleProps<typeof radioStyle>["size"]
}

export const RadioGroupContext = createContext<
  RadioGroupContextValue | undefined
>(undefined)
