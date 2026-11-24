"use client"

import type { ComponentProps, ReactNode } from "react"
import type { ComponentStyleProps } from "../../core/define"
import type { FieldContextValue } from "../field/field-context"
import { ariaAttr, cx } from "@monorepo/utils"
import { useId, useMemo } from "react"
import { splitStyleProps } from "../../core/split-style-props"
import { FieldContext, useFieldContext } from "../field/field-context"
import { fieldsetStyle } from "./fieldset.style"

export interface FieldsetProps
  extends
    Omit<ComponentProps<"fieldset">, "color">,
    ComponentStyleProps<typeof fieldsetStyle> {
  /** The controls and their individual labels. */
  children: ReactNode
  /** The visible label for the group. */
  legend: ReactNode
  /**
   * If `true`, disables the controls through the native fieldset.
   *
   * @default false
   */
  disabled?: boolean
  /** A validation message that replaces the hint and marks the group invalid. */
  error?: ReactNode
  /** A short description of the group. */
  hint?: ReactNode
  /**
   * If `true`, marks the legend. Validate the group's selection in the form.
   *
   * @default false
   */
  required?: boolean
}

const isShown = (node: ReactNode) =>
  node !== undefined && node !== null && node !== false && node !== ""

/** Labels related form controls and connects them to a shared description. */
export function Fieldset({
  size,
  "aria-describedby": describedBy,
  "aria-invalid": ariaInvalid,
  children,
  disabled = false,
  error,
  hint,
  legend,
  required = false,
  ...props
}: FieldsetProps) {
  const generatedId = useId()
  const parent = useFieldContext()
  const groupSize = size ?? parent?.size ?? fieldsetStyle.defaultProps.size
  const hasError = isShown(error)
  const invalid = hasError || ariaInvalid === true || ariaInvalid === "true"
  const message = hasError ? error : hint
  const messageId = isShown(message)
    ? `${props.id ?? generatedId}-message`
    : undefined
  const description = cx(messageId, describedBy)
  const [styleAttributes, rest] = splitStyleProps("fieldset", fieldsetStyle, {
    ...props,
    size: groupSize,
  })
  const context = useMemo<FieldContextValue>(
    () => ({
      size: groupSize,
      disabled,
      invalid,
      readOnly: false,
      required: false,
    }),
    [disabled, invalid, groupSize],
  )

  return (
    <fieldset
      {...styleAttributes}
      {...rest}
      aria-describedby={description}
      aria-invalid={ariaAttr(hasError) ?? ariaInvalid}
      disabled={disabled}
    >
      <legend>
        {legend}
        {required ? <span aria-hidden="true">{" *"}</span> : null}
      </legend>
      <FieldContext value={context}>{children}</FieldContext>
      {messageId ? (
        <span
          id={messageId}
          key={hasError ? "error" : "hint"}
          data-part={hasError ? "error" : "hint"}
          role={hasError ? "alert" : undefined}
        >
          {hasError ? <span aria-hidden="true">{"✕ "}</span> : null}
          {message}
        </span>
      ) : null}
    </fieldset>
  )
}
