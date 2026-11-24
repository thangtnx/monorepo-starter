"use client"

import type { ComponentProps, CSSProperties, ReactNode, Ref } from "react"
import type { StyleAttributes } from "../../core/split-style-props"
import { ariaAttr, cx } from "@monorepo/utils"
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { useFieldContext } from "../field/field-context"
import { checkableAppearance } from "./checkable-appearance"

type NativeInputProps = Omit<
  ComponentProps<"input">,
  "children" | "color" | "size" | "type"
>

export interface CheckableProps extends NativeInputProps {
  /** Text or content that labels the control. */
  children?: ReactNode
  /** Color or color token for the invalid indicator. */
  errorBorderColor?: string
  /** Color or color token for the focus outline. */
  focusBorderColor?: string
  /** Marks the control as invalid. */
  invalid?: boolean
  /** Additional props for the native input. */
  inputProps?: NativeInputProps
  /** Props for the label content. */
  labelProps?: ComponentProps<"span">
  /** Props for the outer element. */
  rootProps?: ComponentProps<"label">
}

export interface CheckableDefaults {
  disabled?: boolean
  form?: string
  invalid?: boolean
  name?: string
  readOnly?: boolean
  required?: boolean
  size?: "lg" | "md" | "sm"
}

interface CheckableOptions {
  checkOnEnter?: boolean
  defaults?: CheckableDefaults
  indeterminate?: boolean
  selection?: { checked: boolean; change: (checked: boolean) => void }
  size?: CheckableDefaults["size"]
}

function attachRef<T>(ref: Ref<T> | undefined, node: T) {
  if (typeof ref === "function") {
    const cleanup = ref(node)
    return typeof cleanup === "function" ? cleanup : () => ref(null)
  }
  if (ref) {
    ref.current = node
    return () => {
      ref.current = null
    }
  }
}

export function useCheckable(
  {
    style,
    children,
    errorBorderColor,
    focusBorderColor,
    invalid,
    inputProps,
    labelProps,
    rootProps,
    ...props
  }: CheckableProps,
  {
    size,
    checkOnEnter,
    defaults,
    indeterminate,
    selection,
  }: CheckableOptions = {},
) {
  const field = useFieldContext()
  const inputRef = useRef<HTMLInputElement>(null)
  const ref = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node
      if (!node) return
      const cleanRef = attachRef(props.ref, node)
      const cleanSlotRef =
        inputProps?.ref !== props.ref
          ? attachRef(inputProps?.ref, node)
          : undefined
      return () => {
        cleanRef?.()
        cleanSlotRef?.()
        inputRef.current = null
      }
    },
    [props.ref, inputProps?.ref],
  )

  useLayoutEffect(() => {
    if (inputRef.current && indeterminate !== undefined)
      inputRef.current.indeterminate = indeterminate
  })

  const id = field?.id ?? inputProps?.id ?? props.id
  const disabled =
    defaults?.disabled ||
    (inputProps?.disabled ?? props.disabled ?? field?.disabled)
  const readOnly =
    defaults?.readOnly ||
    (inputProps?.readOnly ?? props.readOnly ?? field?.readOnly)
  const required =
    defaults?.required ||
    (inputProps?.required ?? props.required ?? field?.required)
  const checked = selection?.checked ?? inputProps?.checked ?? props.checked
  const input = {
    ...props,
    ...inputProps,
    id,
    ref,
    form: inputProps?.form ?? props.form ?? defaults?.form,
    name: defaults?.name ?? inputProps?.name ?? props.name,
    className: cx(props.className, inputProps?.className),
    "aria-describedby": cx(
      field?.describedBy,
      props["aria-describedby"],
      inputProps?.["aria-describedby"],
    ),
    "aria-invalid":
      inputProps?.["aria-invalid"] ??
      props["aria-invalid"] ??
      ariaAttr(invalid ?? (field?.invalid || defaults?.invalid)),
    checked,
    defaultChecked:
      checked === undefined
        ? (inputProps?.defaultChecked ?? props.defaultChecked)
        : undefined,
    disabled,
    readOnly,
    required,
    onChange(event) {
      if (event.currentTarget.matches(":disabled") || readOnly) return
      selection?.change(event.currentTarget.checked)
      props.onChange?.(event)
      if (inputProps?.onChange !== props.onChange) inputProps?.onChange?.(event)
      if (indeterminate !== undefined)
        event.currentTarget.indeterminate = indeterminate
    },
    onClick(event) {
      if (readOnly) event.preventDefault()
      props.onClick?.(event)
      if (inputProps?.onClick !== props.onClick) inputProps?.onClick?.(event)
    },
    onKeyDown(event) {
      if (readOnly && (event.key === " " || event.key.startsWith("Arrow")))
        event.preventDefault()
      props.onKeyDown?.(event)
      if (inputProps?.onKeyDown !== props.onKeyDown)
        inputProps?.onKeyDown?.(event)
      if (
        checkOnEnter &&
        event.key === "Enter" &&
        !readOnly &&
        !event.defaultPrevented &&
        !event.currentTarget.matches(":disabled")
      ) {
        event.preventDefault()
        if (!event.repeat) event.currentTarget.click()
      }
    },
  } satisfies NativeInputProps

  return {
    style,
    size: size ?? defaults?.size ?? field?.size,
    children,
    errorBorderColor,
    focusBorderColor,
    groupChecked: selection?.checked,
    input,
    labelProps,
    rootProps,
  }
}

type ResolvedCheckable = ReturnType<typeof useCheckable>

const colorValue = (color?: string) =>
  color && /^[\w-]+(?:\.[\w-]+)+$/.test(color)
    ? `var(--colors-${color.replaceAll(".", "-")})`
    : color

export function CheckableFrame({
  type,
  attributes,
  control,
  indicator,
}: {
  attributes: StyleAttributes
  control: ResolvedCheckable
  indicator: ReactNode
  type: "checkbox" | "radio" | "switch"
}) {
  const {
    style: rootStyle,
    size,
    children,
    errorBorderColor,
    focusBorderColor,
    groupChecked,
    input,
    labelProps,
    rootProps,
  } = control
  // Controls with external labels also support existing wrapping <label> elements.
  const Root = children != null && children !== false ? "label" : "span"
  const { className, ...data } = attributes
  if (size !== undefined) data["data-size"] = size
  const style = {
    ...checkableAppearance(
      type,
      data["data-size"],
      data["data-shape"],
      data["data-variant"],
    ),
    ...rootStyle,
    ...rootProps?.style,
  } as CSSProperties & ReturnType<typeof checkableAppearance>
  if (errorBorderColor !== undefined)
    style["--check-error"] = colorValue(errorBorderColor)
  if (focusBorderColor !== undefined)
    style["--check-focus"] = colorValue(focusBorderColor)

  return (
    <Root
      {...rootProps}
      {...data}
      className={cx("ui-checkable", className, rootProps?.className)}
      style={style}
      data-part="root"
    >
      <input
        {...data}
        {...input}
        type={type === "switch" ? "checkbox" : type}
        aria-readonly={
          type === "radio"
            ? undefined
            : (input["aria-readonly"] ?? ariaAttr(input.readOnly))
        }
        data-group-checked={groupChecked}
        data-part="input"
        // oxlint-disable-next-line jsx-a11y/role-has-required-aria-props -- the native checkbox exposes its checked state
        role={type === "switch" ? "switch" : input.role}
      />
      {indicator}
      {Root === "label" ? (
        <span {...labelProps} data-part="label">
          {children}
        </span>
      ) : null}
    </Root>
  )
}

export function useCheckableGroup<Value>(
  controlledValue: undefined | { value: Value },
  defaultValue: Value,
  onChange?: (value: Value) => void,
  formId?: string,
  ref?: Ref<HTMLFieldSetElement>,
) {
  const fieldsetRef = useRef<HTMLFieldSetElement>(null)
  const setFieldsetRef = useCallback(
    (node: HTMLFieldSetElement | null) => {
      fieldsetRef.current = node
      if (!node) return
      const cleanup = attachRef(ref, node)
      return () => {
        cleanup?.()
        fieldsetRef.current = null
      }
    },
    [ref],
  )
  const initialValue = useRef(defaultValue)
  const [localValue, setLocalValue] = useState(defaultValue)
  const controlled = controlledValue !== undefined

  useEffect(() => {
    const fieldset = fieldsetRef.current
    const form = fieldset?.form
    const reset = (event: Event) => {
      queueMicrotask(() => {
        if (event.defaultPrevented || !fieldset?.isConnected) return
        if (!controlled) setLocalValue(initialValue.current)
        // A form reset also rewrites the DOM checked state of React-controlled inputs.
        for (const input of fieldset.querySelectorAll<HTMLInputElement>(
          "input[data-group-checked]",
        ))
          if (
            input.form === form &&
            input.closest("fieldset.ui-checkable-group") === fieldset
          )
            input.checked = input.dataset.groupChecked === "true"
      })
    }
    form?.addEventListener("reset", reset)
    return () => form?.removeEventListener("reset", reset)
  }, [controlled, formId])

  return {
    change(next: Value) {
      if (!controlled) setLocalValue(next)
      onChange?.(next)
    },
    fieldsetRef: setFieldsetRef,
    value: controlledValue ? controlledValue.value : localValue,
  }
}
