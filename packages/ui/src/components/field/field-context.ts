"use client"

import { createContext, use } from "react"

export interface FieldContextValue {
  disabled: boolean
  invalid: boolean
  readOnly: boolean
  required: boolean
  /** Id of the hint or error message that describes the control. */
  describedBy?: string
  id?: string
  size?: "lg" | "md" | "sm"
}

export const FieldContext = createContext<FieldContextValue | undefined>(
  undefined,
)

/** Returns the surrounding field state, if any. */
export const useFieldContext = () => use(FieldContext)
