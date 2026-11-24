"use client"

import type { ComponentProps, KeyboardEvent, ReactNode } from "react"
import type { ComponentStyleProps } from "../../core/define"
import type { SelectItem, SelectItemGroup } from "./select-options"
import { ariaAttr, cx } from "@monorepo/utils"
import {
  Fragment,
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { flushSync } from "react-dom"
import { splitStyleProps } from "../../core/split-style-props"
import { useFieldContext } from "../field/field-context"
import { ChevronDown, Icon, X } from "../icon"
import { selectCopy, typeaheadTimeout } from "./select-config"
import { selectListboxStyle } from "./select-listbox.style"
import { SelectContext, SelectOption } from "./select-option"
import { getSelectOptions, renderItems } from "./select-options"
import { useSelectPopover } from "./select-popover"
import { selectRootStyle } from "./select-root.style"
import { findSelectMatch } from "./select-typeahead"
import { selectStyle } from "./select.style"

type SelectValue<Multiple extends boolean> = Multiple extends true
  ? readonly string[]
  : string

export interface SelectRenderProps {
  /** The number of selected values. */
  count: number
  /** The option's zero-based position among the selected values. */
  index: number
  /** The selected option's visible label. */
  label: ReactNode
  /** The separator configured for the selected values. */
  separator: string
  /** The selected option's value. */
  value: string
}

export interface SelectRootProps<Multiple extends boolean = boolean>
  extends
    Omit<
      ComponentProps<"button">,
      "color" | "defaultValue" | "onChange" | "value"
    >,
    ComponentStyleProps<typeof selectStyle> {
  /**
   * Declarative SelectOption, SelectGroup, SelectLabel and SelectSeparator
   * parts. They are found by element type through fragments and groups only:
   * an option rendered inside another component is not registered.
   */
  children?: ReactNode
  /**
   * Shows a button that clears the current selection.
   *
   * @default false
   */
  clearable?: boolean
  /** The initial selection and the selection restored by form reset. */
  defaultValue?: SelectValue<Multiple>
  /**
   * Disables the trigger and omits the selection from form submissions.
   *
   * @default false
   */
  disabled?: boolean
  /** The trigger id. When wrapped in a Field, set the id on Field. */
  id?: string
  /**
   * Makes the placeholder an option that clears the selection.
   *
   * @default true for single select and false for multiple select
   */
  includePlaceholder?: boolean
  /**
   * Marks the trigger as invalid.
   *
   * @default false
   */
  invalid?: boolean
  /** Options and groups to render in place of children. */
  items?: readonly (SelectItem | SelectItemGroup)[]
  /** Maximum number of simultaneous selections in multiple mode. */
  max?: number
  /**
   * Allows selecting more than one option.
   *
   * @default false
   */
  multiple?: Multiple
  /** The form field name. Multiple values are submitted as repeated entries. */
  name?: string
  /** Text displayed when there is no selection. */
  placeholder?: string
  /**
   * Keeps the trigger focusable and prevents selection changes.
   *
   * @default false
   */
  readOnly?: boolean
  /**
   * Requires a non-empty selection before submission.
   *
   * @default false
   */
  required?: boolean
  /**
   * Text inserted between selected labels in multiple mode.
   *
   * @default ", "
   */
  separator?: string
  /**
   * The height and padding of the trigger.
   *
   * @default "md"
   */
  size?: "lg" | "md" | "sm"
  /** The current selection when controlled. */
  value?: SelectValue<Multiple>
  /**
   * The visual treatment of the trigger.
   *
   * @default "outline"
   */
  variant?: "filled" | "flushed" | "outline"
  /** Called with the next selection when the user changes it. */
  onChange?: (value: Multiple extends true ? string[] : string) => void
  /** Renders each selected option in the trigger. */
  render?: (option: SelectRenderProps) => ReactNode
}

const toValues = (value: readonly string[] | string | undefined) =>
  typeof value === "string" ? (value ? [value] : []) : (value ?? [])

function getNativeLabel(trigger: HTMLButtonElement | null) {
  return Array.from(trigger?.labels ?? [], (label) => {
    const copy = label.cloneNode(true) as HTMLLabelElement
    for (const hidden of copy.querySelectorAll(
      '[aria-hidden="true"], [hidden]',
    ))
      hidden.remove()
    return label.getAttribute("aria-label") ?? copy.textContent.trim()
  })
    .filter(Boolean)
    .join(" ")
}

export function SelectRoot<Multiple extends boolean = false>(
  props: SelectRootProps<Multiple>,
) {
  const field = useFieldContext()
  const generatedId = useId()
  const [triggerStyle, rest] = splitStyleProps("select", selectStyle, {
    ...props,
    size: props.size ?? field?.size,
  })
  const {
    id = generatedId,
    ref,
    form,
    name,
    "aria-describedby": describedBy,
    "aria-invalid": ariaInvalid,
    "aria-label": ariaLabel,
    "aria-labelledby": labelledBy,
    children,
    clearable,
    defaultValue,
    disabled = field?.disabled,
    multiple,
    includePlaceholder = !multiple,
    invalid = field?.invalid,
    items,
    max,
    placeholder,
    readOnly = field?.readOnly,
    render,
    required = field?.required,
    separator = ", ",
    value,
    onBlur,
    onChange,
    onClick,
    onKeyDown,
    onKeyUp,
    onPointerDown,
    ...buttonProps
  } = rest
  const triggerId = field?.id ?? id
  const listboxId = `${triggerId}-listbox`
  const messageId = `${triggerId}-required`
  const labelClick = useRef(false)
  const pressing = useRef(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [localValue, setLocalValue] = useState(() => toValues(defaultValue))
  const [open, setOpen] = useState(false)
  const [nativeLabel, setNativeLabel] = useState("")
  const [active, setActive] = useState<string>()
  const [missing, setMissing] = useState(false)
  const search = useRef<ReturnType<typeof findSelectMatch>["search"]>(undefined)
  const defaults = useRef(toValues(defaultValue))
  const values = value === undefined ? localValue : toValues(value)
  const selected = new Set(values.length ? values : [""])
  const contents = (
    <>
      {includePlaceholder && placeholder && (
        <SelectOption value="">{placeholder}</SelectOption>
      )}
      {items ? renderItems(items) : children}
    </>
  )
  const options = getSelectOptions(contents, listboxId)
  const atLimit = multiple && max !== undefined && values.length >= max
  for (const option of options.values())
    if (atLimit && option.value && !selected.has(option.value))
      option.disabled = true

  const enabled = [...options.values()].filter((option) => !option.disabled)
  const activeId = open
    ? enabled.find((option) => option.value === active)?.id
    : undefined
  const canClear = clearable && values.length > 0 && !disabled && !readOnly

  const attachRef = useCallback(
    (node: HTMLButtonElement | null) => {
      triggerRef.current = node
      const cleanup = typeof ref === "function" ? ref(node) : undefined
      if (ref && typeof ref !== "function") ref.current = node
      if (!node) return

      return () => {
        triggerRef.current = null
        if (typeof cleanup === "function") cleanup()
        else if (typeof ref === "function") ref(null)
        else if (ref) ref.current = null
      }
    },
    [ref],
  )

  const close = useCallback(() => {
    setOpen(false)
    setActive(undefined)
    search.current = undefined
  }, [])

  useSelectPopover(
    open && !disabled && !readOnly,
    triggerRef,
    panelRef,
    activeId,
    close,
  )

  useLayoutEffect(() => {
    if (disabled || readOnly) close()
  }, [close, disabled, readOnly])

  useLayoutEffect(() => {
    const owner = triggerRef.current?.form
    if (!owner) return

    let mounted = true
    const reset = (event: Event) => {
      queueMicrotask(() => {
        if (!mounted || event.defaultPrevented) return
        setLocalValue(defaults.current)
        setMissing(false)
        close()
      })
    }
    owner.addEventListener("reset", reset)
    return () => {
      mounted = false
      owner.removeEventListener("reset", reset)
    }
  }, [close, form])

  // A label forwards its click to the trigger as a second click event. Mark it
  // so the trigger only takes focus, as a native select does.
  useLayoutEffect(() => {
    const trigger = triggerRef.current
    if (!trigger) return

    const document = trigger.ownerDocument
    const mark = (event: MouseEvent) => {
      const target = event.target
      if (
        !(target instanceof Element) ||
        trigger.contains(target) ||
        target.closest("label")?.control !== trigger
      )
        return
      labelClick.current = true
      setTimeout(() => {
        labelClick.current = false
      })
    }
    document.addEventListener("click", mark, true)
    return () => document.removeEventListener("click", mark, true)
  }, [])

  function change(next: string[]) {
    if (next.length > 0) setMissing(false)
    if (value === undefined) setLocalValue(next)
    if (
      next.length === values.length &&
      next.every((item, index) => item === values[index])
    )
      return
    onChange?.(
      (multiple ? next : (next[0] ?? "")) as Parameters<
        NonNullable<typeof onChange>
      >[0],
    )
  }

  function choose(next: string) {
    const option = options.get(next)
    if (disabled || readOnly || !option || option.disabled) return
    if (multiple) {
      change(
        next === ""
          ? []
          : selected.has(next)
            ? values.filter((item) => item !== next)
            : [...values, next],
      )
    } else {
      change(next ? [next] : [])
      close()
    }
  }

  function show(
    next = enabled.find((option) => selected.has(option.value))?.value ??
      enabled[0]?.value,
  ) {
    if (!open && !ariaLabel && !labelledBy)
      setNativeLabel(getNativeLabel(triggerRef.current))
    setActive(next)
    setOpen(true)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    onKeyDown?.(event)
    if (
      event.defaultPrevented ||
      disabled ||
      readOnly ||
      event.nativeEvent.isComposing ||
      event.ctrlKey ||
      event.metaKey
    )
      return

    const { key } = event
    if (event.altKey && key !== "ArrowDown" && key !== "ArrowUp") return

    // Space extends a search in progress instead of selecting.
    const searching =
      search.current !== undefined &&
      event.timeStamp - search.current.time < typeaheadTimeout
    if (Array.from(key).length === 1 && (key !== " " || searching)) {
      const { match, search: nextSearch } = findSelectMatch(
        enabled,
        active,
        key,
        event.timeStamp,
        search.current,
      )
      search.current = nextSearch
      show(match?.value ?? active)
      event.preventDefault()
      return
    }
    search.current = undefined

    switch (key) {
      case "Tab":
        if (open && !multiple && activeId && active !== undefined)
          choose(active)
        close()
        return
      case "Escape":
        if (!open) return
        event.stopPropagation()
        close()
        break
      case "ArrowDown":
      case "ArrowUp": {
        const index = enabled.findIndex((option) => option.value === active)
        if (!open) {
          show(key === "ArrowUp" ? enabled[0]?.value : undefined)
        } else if (event.altKey && key === "ArrowUp") {
          if (!multiple && activeId && active !== undefined) choose(active)
          close()
        } else if (!event.altKey) {
          const offset = key === "ArrowDown" ? 1 : -1
          setActive(
            enabled[Math.max(0, Math.min(enabled.length - 1, index + offset))]
              ?.value,
          )
        }
        break
      }
      case "Home":
        show(enabled[0]?.value)
        break
      case "End":
        show(enabled.at(-1)?.value)
        break
      case "Enter":
      case " ":
        if (!open) show()
        else if (activeId && active !== undefined) choose(active)
        break
      default:
        return
    }

    event.preventDefault()
  }

  const [rootStyle] = splitStyleProps("select-root", selectRootStyle, {})
  const [listboxStyle] = splitStyleProps("select-listbox", selectListboxStyle, {
    colorScheme: props.colorScheme,
  })
  const selection = values.length > 0
  const visible = open && !disabled && !readOnly
  const showMessage = missing && !selection && required && !invalid

  return (
    <div {...rootStyle} data-clearable={canClear || undefined}>
      <button
        {...triggerStyle}
        {...buttonProps}
        id={triggerId}
        ref={attachRef}
        form={form}
        type="button"
        aria-activedescendant={visible ? activeId : undefined}
        aria-controls={listboxId}
        aria-describedby={cx(
          field?.describedBy,
          describedBy,
          showMessage ? messageId : undefined,
        )}
        aria-expanded={visible}
        aria-haspopup="listbox"
        aria-invalid={
          ariaAttr(invalid || (missing && !selection && required)) ??
          ariaInvalid
        }
        aria-label={ariaLabel}
        aria-labelledby={labelledBy}
        aria-readonly={ariaAttr(readOnly)}
        aria-required={ariaAttr(required)}
        disabled={disabled}
        role="combobox"
        onBlur={(event) => {
          onBlur?.(event)
          // WebKit blurs a pressed button before its click. Closing here would
          // make that click open the list again, so the click toggles instead.
          if (!pressing.current) close()
        }}
        onClick={(event) => {
          onClick?.(event)
          if (event.defaultPrevented || readOnly || disabled) return
          event.currentTarget.focus()
          if (labelClick.current) {
            labelClick.current = false
            return
          }
          if (open) close()
          else show()
        }}
        onKeyDown={handleKeyDown}
        onKeyUp={(event) => {
          onKeyUp?.(event)
          // Some browsers click a button on Space keyup even after keydown
          // handled it, which would toggle the list a second time.
          if (event.key === " ") event.preventDefault()
        }}
        onPointerDown={(event) => {
          onPointerDown?.(event)
          if (event.button !== 0) return
          pressing.current = true
          const document = event.currentTarget.ownerDocument
          const trigger = event.currentTarget
          const release = (up: Event) => {
            pressing.current = false
            // Released elsewhere: no click follows, so apply the skipped close.
            if (
              !(up.target instanceof Node && trigger.contains(up.target)) &&
              document.activeElement !== trigger
            )
              close()
            document.removeEventListener("pointerup", release, true)
            document.removeEventListener("pointercancel", release, true)
          }
          document.addEventListener("pointerup", release, true)
          document.addEventListener("pointercancel", release, true)
        }}
      >
        <span data-part="value" data-placeholder={!selection || undefined}>
          {selection
            ? values.map((item, index) => {
                const label = options.get(item)?.label ?? item
                return (
                  <Fragment key={item}>
                    {index > 0 && separator}
                    {render
                      ? render({
                          count: values.length,
                          index,
                          label,
                          separator,
                          value: item,
                        })
                      : label}
                  </Fragment>
                )
              })
            : placeholder}
        </span>
        <Icon as={ChevronDown} data-part="chevron" strokeWidth="1.5" />
      </button>
      {canClear && (
        <button
          type="button"
          aria-label={selectCopy.clear}
          data-part="clear"
          onClick={() => {
            change([])
            close()
            triggerRef.current?.focus()
          }}
        >
          <Icon as={X} strokeWidth="1.5" />
        </button>
      )}
      {showMessage && (
        <div id={messageId} data-part="message">
          {selectCopy.required}
        </div>
      )}
      {/* oxlint-disable-next-line jsx-a11y/interactive-supports-focus -- The combobox owns focus; the panel must never take it. */}
      <div
        {...listboxStyle}
        id={listboxId}
        ref={panelRef}
        aria-label={ariaLabel || nativeLabel || selectCopy.listbox}
        aria-labelledby={labelledBy}
        aria-multiselectable={ariaAttr(multiple)}
        hidden={!visible}
        popover="manual"
        role="listbox"
        // Keep DOM focus on the combobox for every press in the panel; losing
        // it would close the list.
        onMouseDown={(event) => event.preventDefault()}
      >
        <div role="presentation">
          <SelectContext
            value={{ active, choose, options, selected, setActive }}
          >
            {contents}
          </SelectContext>
          {options.size === 0 && (
            <div
              aria-disabled="true"
              aria-selected="false"
              data-part="option"
              role="option"
            >
              {selectCopy.empty}
            </div>
          )}
        </div>
      </div>
      {name &&
        (multiple ? values : [values[0] ?? ""]).map((item) => (
          <input
            key={item}
            form={form}
            type="hidden"
            name={name}
            disabled={disabled}
            value={item}
          />
        ))}
      {required && !readOnly && (
        <input
          form={form}
          aria-hidden="true"
          data-part="validation"
          disabled={disabled}
          required
          tabIndex={-1}
          value={values[0] ?? ""}
          onChange={() => {}}
          onInvalid={(event) => {
            event.preventDefault()
            // Commit the message before focus lands so it is read with the trigger.
            flushSync(() => setMissing(true))
            const first = Array.from(
              event.currentTarget.form?.elements ?? [],
            ).find((control) => !(control as HTMLInputElement).validity.valid)
            if (!first || first === event.currentTarget)
              triggerRef.current?.focus()
          }}
        />
      )}
    </div>
  )
}
