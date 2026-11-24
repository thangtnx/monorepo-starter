"use client"

import type { ComponentProps, ReactNode } from "react"
import type { ComponentStyleProps } from "../../core/define"
import type { RadioProps } from "./radio"
import { ariaAttr, cx } from "@monorepo/utils"
import { useId } from "react"
import { splitStyleProps } from "../../core/split-style-props"
import { checkableGroupStyle } from "../checkbox/checkable-group.style"
import { useCheckableGroup } from "../checkbox/checkbox-control"
import { FieldContext, useFieldContext } from "../field/field-context"
import { Radio } from "./radio"
import { RadioGroupContext } from "./radio-group-context"

interface RadioGroupOption<Value extends string> extends Omit<
  RadioProps,
  "children" | "value"
> {
  /** Text or content that labels this option. */
  label: ReactNode
  /** The option's submitted value. */
  value: Value
}

export interface RadioGroupRootProps<Value extends string = string>
  extends
    Omit<ComponentProps<"fieldset">, "color" | "onChange">,
    ComponentStyleProps<typeof checkableGroupStyle>,
    Pick<
      RadioProps,
      | "errorBorderColor"
      | "focusBorderColor"
      | "invalid"
      | "readOnly"
      | "required"
      | "shape"
      | "size"
      | "variant"
    > {
  /** The initial selection for an uncontrolled group. */
  defaultValue?: Value
  /** Options to render when children are omitted. */
  items?: readonly RadioGroupOption<Value>[]
  /** The visible label for the group. */
  legend?: ReactNode
  /** The controlled selection. */
  value?: Value
  /** Called with the value of the selected radio. */
  onChange?: (value: Value) => void
}

export type RadioGroupProps<Value extends string = string> =
  RadioGroupRootProps<Value>

/** RadioGroup labels itself with its legend. Use it outside Field. */
export function RadioGroupRoot<Value extends string = string>(
  rootProps: RadioGroupRootProps<Value>,
) {
  const {
    ref,
    name,
    colorScheme,
    size,
    variant,
    children,
    defaultValue,
    disabled,
    errorBorderColor,
    focusBorderColor,
    invalid,
    items,
    legend,
    readOnly,
    required,
    shape,
    value,
    onChange,
    ...props
  } = rootProps
  const field = useFieldContext()
  const generatedName = useId()
  const controlled = "value" in rootProps
  const group = useCheckableGroup<undefined | Value>(
    controlled ? { value } : undefined,
    defaultValue,
    (next) => {
      if (next !== undefined) onChange?.(next)
    },
    props.form,
    ref,
  )
  // Allow existing children with individual defaultChecked props to use native selection.
  const managed =
    controlled ||
    items !== undefined ||
    "defaultValue" in rootProps ||
    onChange !== undefined
  const [attributes, rest] = splitStyleProps(
    "checkable-group",
    checkableGroupStyle,
    {
      ...props,
      className: cx("ui-radio-group", props.className),
      colorScheme,
    },
  )
  const groupInvalid =
    invalid ??
    (rest["aria-invalid"] === true ||
      rest["aria-invalid"] === "true" ||
      field?.invalid)
  const defaults = {
    form: props.form,
    name: name ?? generatedName,
    size: size ?? field?.size,
    disabled: disabled ?? field?.disabled,
    invalid: groupInvalid,
    readOnly: readOnly ?? field?.readOnly,
    required: required ?? field?.required,
  }

  return (
    <fieldset
      {...attributes}
      {...rest}
      id={field?.id ?? rest.id}
      ref={group.fieldsetRef}
      name={defaults.name}
      aria-describedby={cx(field?.describedBy, rest["aria-describedby"])}
      aria-invalid={rest["aria-invalid"] ?? ariaAttr(groupInvalid)}
      aria-readonly={ariaAttr(defaults.readOnly)}
      aria-required={ariaAttr(defaults.required)}
      disabled={defaults.disabled}
      role="radiogroup"
    >
      {legend != null ? (
        <legend>
          {legend}
          {defaults.required ? <span aria-hidden="true">{" *"}</span> : null}
        </legend>
      ) : null}
      <FieldContext value={undefined}>
        <RadioGroupContext
          value={{
            appearance: { variant, errorBorderColor, focusBorderColor, shape },
            defaults,
            managed,
            select(next) {
              if (group.value !== next) group.change(next as Value)
            },
            value: group.value,
          }}
        >
          {children ??
            items?.map(({ label, value, ...option }) => (
              <Radio key={value} {...option} value={value}>
                {label}
              </Radio>
            ))}
        </RadioGroupContext>
      </FieldContext>
    </fieldset>
  )
}

export { Radio as RadioGroupItem }

/** The callable group also exposes its root and item for composition. */
export const RadioGroup = Object.assign(RadioGroupRoot, {
  Item: Radio,
  Root: RadioGroupRoot,
})
