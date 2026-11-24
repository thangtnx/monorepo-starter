"use client"

import type { ComponentProps, ReactNode } from "react"
import type { ComponentStyleProps } from "../../core/define"
import { ariaAttr, cx } from "@monorepo/utils"
import { useId } from "react"
import { splitStyleProps } from "../../core/split-style-props"
import { FieldContext, useFieldContext } from "../field/field-context"
import { RadioGroupContext } from "./radio-group-context"
import { radioGroupStyle } from "./radio-group.style"

export interface RadioGroupProps
  extends
    Omit<ComponentProps<"fieldset">, "color">,
    ComponentStyleProps<typeof radioGroupStyle> {
  /** The radio controls and their labels. */
  children: ReactNode
  /** The visible label for the group, rendered as its legend. */
  legend: ReactNode
  /** The form name shared by all radios. An omitted name is generated. */
  name?: string
  /**
   * Keeps the current choice focusable and prevents changes in the group.
   *
   * @default false
   */
  readOnly?: boolean
  /**
   * Requires a selection before the form can be submitted.
   *
   * @default false
   */
  required?: boolean
}

/** RadioGroup labels itself with its legend. Use it outside Field. */
export function RadioGroup(props: RadioGroupProps) {
  const field = useFieldContext()
  const generatedName = useId()
  const size = props.size ?? field?.size
  const [styleAttributes, rest] = splitStyleProps(
    "radio-group",
    radioGroupStyle,
    { ...props, size },
  )
  const {
    name = generatedName,
    "aria-invalid": invalid = ariaAttr(field?.invalid),
    children,
    disabled = field?.disabled,
    legend,
    readOnly = field?.readOnly,
    required = field?.required,
    ...fieldset
  } = rest

  return (
    <fieldset
      {...styleAttributes}
      {...fieldset}
      id={field?.id ?? rest.id}
      name={name}
      aria-describedby={cx(field?.describedBy, rest["aria-describedby"])}
      aria-invalid={invalid}
      aria-readonly={ariaAttr(readOnly)}
      aria-required={ariaAttr(required)}
      disabled={disabled}
      role="radiogroup"
    >
      <legend>
        {legend}
        {required ? <span aria-hidden="true">{" *"}</span> : null}
      </legend>
      <FieldContext value={undefined}>
        <RadioGroupContext
          value={{
            name,
            size,
            invalid: invalid === true || invalid === "true",
            readOnly,
            required,
          }}
        >
          {children}
        </RadioGroupContext>
      </FieldContext>
    </fieldset>
  )
}
