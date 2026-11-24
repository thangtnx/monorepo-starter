"use client"

import type { ComponentProps, ReactNode } from "react"
import type { ComponentStyleProps } from "../../core/define"
import type { CheckboxProps } from "./checkbox"
import { ariaAttr, cx } from "@monorepo/utils"
import { useId } from "react"
import { splitStyleProps } from "../../core/split-style-props"
import { FieldContext, useFieldContext } from "../field/field-context"
import { checkableGroupStyle } from "./checkable-group.style"
import { Checkbox, CheckboxGroupContext } from "./checkbox"
import { useCheckableGroup } from "./checkbox-control"

interface CheckboxGroupOption<Value extends string> extends Omit<
  CheckboxProps,
  "children" | "value"
> {
  /** Text or content that labels this option. */
  label: ReactNode
  /** The option's submitted value. */
  value: Value
}

export interface CheckboxGroupRootProps<Value extends string = string>
  extends
    Omit<ComponentProps<"fieldset">, "color" | "onChange">,
    ComponentStyleProps<typeof checkableGroupStyle>,
    Pick<
      CheckboxProps,
      | "checkedIcon"
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
  defaultValue?: readonly Value[]
  /** Options to render when children are omitted. */
  items?: readonly CheckboxGroupOption<Value>[]
  /** The visible label for the group. */
  legend?: ReactNode
  /** Maximum number of options that may be selected. */
  max?: number
  /** The controlled list of selected values. */
  value?: readonly Value[]
  /** Called when the selected values change. */
  onChange?: (value: Value[]) => void
}

export function CheckboxGroupRoot<Value extends string = string>({
  ref,
  name,
  colorScheme,
  size,
  variant,
  checkedIcon,
  children,
  defaultValue = [],
  disabled,
  errorBorderColor,
  focusBorderColor,
  invalid,
  items,
  legend,
  max,
  readOnly,
  required = false,
  shape,
  value,
  onChange,
  ...props
}: CheckboxGroupRootProps<Value>) {
  const field = useFieldContext()
  const group = useCheckableGroup(
    value === undefined ? undefined : { value },
    defaultValue,
    (next) => onChange?.([...next]),
    props.form,
    ref,
  )
  const generatedName = useId()
  const [attributes, rest] = splitStyleProps(
    "checkable-group",
    checkableGroupStyle,
    { ...props, colorScheme },
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
  }

  return (
    <fieldset
      {...attributes}
      {...rest}
      ref={group.fieldsetRef}
      name={name}
      aria-describedby={cx(field?.describedBy, rest["aria-describedby"])}
      aria-invalid={rest["aria-invalid"] ?? ariaAttr(groupInvalid)}
      disabled={defaults.disabled}
    >
      {legend != null ? (
        <legend>
          {legend}
          {required ? <span aria-hidden="true">{" *"}</span> : null}
        </legend>
      ) : null}
      <FieldContext value={undefined}>
        <CheckboxGroupContext
          value={{
            appearance: { variant, errorBorderColor, focusBorderColor, shape },
            checkedIcon,
            defaults,
            max,
            toggle(item, checked) {
              const option = item as Value
              if (group.value.includes(option) === checked) return
              if (checked && max !== undefined && group.value.length >= max)
                return
              group.change(
                checked
                  ? [...group.value, option]
                  : group.value.filter((entry) => entry !== option),
              )
            },
            values: group.value,
          }}
        >
          {children ??
            items?.map(({ label, value, ...option }) => (
              <Checkbox key={value} {...option} value={value}>
                {label}
              </Checkbox>
            ))}
        </CheckboxGroupContext>
      </FieldContext>
    </fieldset>
  )
}

export { Checkbox as CheckboxGroupItem }
