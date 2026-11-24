"use client"

import type { ComponentStyleProps } from "../../core/define"
import type {
  CheckableDefaults,
  CheckableProps,
} from "../checkbox/checkbox-control"
import type { radioStyle } from "./radio.style"
import { createContext } from "react"

export const RadioGroupContext = createContext<
  | undefined
  | {
      appearance: ComponentStyleProps<typeof radioStyle> &
        Pick<CheckableProps, "errorBorderColor" | "focusBorderColor">
      defaults: CheckableDefaults
      managed: boolean
      select: (value: string) => void
      value?: string
    }
>(undefined)
