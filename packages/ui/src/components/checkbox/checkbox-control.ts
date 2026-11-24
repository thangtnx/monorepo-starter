"use client"

import type { ComponentProps } from "react"
import { ariaAttr, cx } from "@monorepo/utils"
import { useFieldContext } from "../field/field-context"

type CheckableProps = Omit<
  ComponentProps<"input">,
  "children" | "color" | "size" | "type"
>

export function useCheckableProps(
  props: CheckableProps,
  defaults?: Pick<CheckableProps, "disabled" | "readOnly" | "required"> & {
    invalid?: boolean
  },
) {
  const field = useFieldContext()
  const {
    // cspell:ignore describedby
    "aria-describedby": describedBy,
    disabled = field?.disabled ?? defaults?.disabled,
    readOnly = field?.readOnly ?? defaults?.readOnly,
    required = field?.required ?? defaults?.required,
    onChange,
    onClick,
    onKeyDown,
    ...rest
  } = props

  return {
    "aria-invalid": ariaAttr(field?.invalid || defaults?.invalid),
    ...rest,
    id: field?.id ?? rest.id,
    "aria-describedby": cx(field?.describedBy, describedBy),
    disabled,
    readOnly,
    required,
    onChange(event) {
      if (!readOnly) onChange?.(event)
    },
    onClick(event) {
      if (readOnly) event.preventDefault()
      onClick?.(event)
    },
    onKeyDown(event) {
      if (readOnly && (event.key === " " || event.key.startsWith("Arrow")))
        event.preventDefault()
      onKeyDown?.(event)
    },
  } satisfies CheckableProps
}
