"use client"

import type { ComponentProps, ReactNode } from "react"
import { dataAttr } from "@monorepo/utils"
import { useId, useMemo } from "react"
import { splitStyleProps } from "../../core/split-style-props"
import { FieldContext } from "./field-context"
import { fieldStyle } from "./field.style"

export interface FieldProps extends Omit<ComponentProps<"div">, "id"> {
  /**
   * The form control, such as `Input`. It receives the id and ARIA wiring.
   */
  children: ReactNode
  /**
   * If `true`, the control is disabled.
   *
   * @default false
   */
  disabled?: boolean
  /**
   * The error message. When set, it replaces the hint and marks the control
   * invalid. Say how to fix the value.
   */
  error?: ReactNode
  /**
   * A short hint shown under the control.
   */
  hint?: ReactNode
  /**
   * The id of the control. Generated when omitted.
   */
  id?: string
  /**
   * The visible label of the control.
   */
  label?: ReactNode
  /**
   * If `true`, the control is read-only.
   *
   * @default false
   */
  readOnly?: boolean
  /**
   * If `true`, the control is required and the label shows a marker.
   *
   * @default false
   */
  required?: boolean
}

const isShown = (node: ReactNode) =>
  node !== undefined && node !== null && node !== false && node !== ""

/** Connects a label, hint and error message to the form control inside it. */
export function Field({
  id,
  children,
  disabled = false,
  error,
  hint,
  label,
  readOnly = false,
  required = false,
  ...props
}: FieldProps) {
  const generatedId = useId()
  const controlId = id ?? generatedId
  const invalid = isShown(error)
  const message = invalid ? error : hint
  const messageId = `${controlId}-message`
  const hasMessage = isShown(message)
  const [styleAttributes, rest] = splitStyleProps("field", fieldStyle, props)
  const context = useMemo(
    () => ({
      id: controlId,
      describedBy: hasMessage ? messageId : undefined,
      disabled,
      invalid,
      readOnly,
      required,
    }),
    [controlId, disabled, hasMessage, invalid, messageId, readOnly, required],
  )

  return (
    <FieldContext value={context}>
      <div
        {...styleAttributes}
        data-disabled={dataAttr(disabled)}
        data-invalid={dataAttr(invalid)}
        {...rest}
      >
        {isShown(label) ? (
          <label htmlFor={controlId} data-part="label">
            {label}
            {required ? (
              <span aria-hidden="true" data-part="required">
                {" *"}
              </span>
            ) : null}
          </label>
        ) : null}
        {children}
        {hasMessage ? (
          <span id={messageId} data-part={invalid ? "error" : "hint"}>
            {invalid ? <span aria-hidden="true">{"✕ "}</span> : null}
            {message}
          </span>
        ) : null}
      </div>
    </FieldContext>
  )
}
