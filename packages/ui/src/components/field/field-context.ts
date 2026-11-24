"use client"

import { createContext, use } from "react"

export interface FieldContextValue {
  disabled: boolean
  id: string
  invalid: boolean
  readOnly: boolean
  required: boolean
  /** Id of the hint or error message that describes the control. */
  describedBy?: string
}

export const FieldContext = createContext<FieldContextValue | undefined>(
  undefined,
)

/** Returns the surrounding `Field`, or `undefined` outside one. */
export const useFieldContext = () => use(FieldContext)
