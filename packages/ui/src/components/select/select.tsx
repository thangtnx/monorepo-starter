"use client"

import type { ComponentProps } from "react"
import type { ComponentStyleProps } from "../../core/define"
import { ariaAttr, cx } from "@monorepo/utils"
import { useCallback, useLayoutEffect, useRef } from "react"
import { splitStyleProps } from "../../core/split-style-props"
import { useFieldContext } from "../field/field-context"
import { selectStyle } from "./select.style"

export interface SelectProps
  extends
    Omit<ComponentProps<"select">, "color" | "size">,
    ComponentStyleProps<typeof selectStyle> {
  /** The select id. When wrapped in a Field, set the id on Field. */
  id?: string
  /**
   * Keeps the select focusable and preserves its value in form submissions.
   *
   * @default false
   */
  readOnly?: boolean
  /** How many rows to display in a native list box. */
  visibleRows?: number
}

const readSelection = (select: HTMLSelectElement) =>
  Array.from(select.options, (option) => option.selected)

export function Select(props: SelectProps) {
  const field = useFieldContext()
  const [styleAttributes, rest] = splitStyleProps("select", selectStyle, props)
  const {
    ref,
    readOnly = field?.readOnly,
    visibleRows,
    onChange,
    onKeyDown,
    onPointerDown,
    ...selectProps
  } = rest
  const selectRef = useRef<HTMLSelectElement>(null)
  const selected = useRef<boolean[]>([])
  const attachRef = useCallback(
    (node: HTMLSelectElement | null) => {
      selectRef.current = node
      const cleanup = typeof ref === "function" ? ref(node) : undefined
      if (ref && typeof ref !== "function") ref.current = node
      if (!node) return

      return () => {
        selectRef.current = null
        if (typeof cleanup === "function") cleanup()
        else if (typeof ref === "function") ref(null)
        else if (ref) ref.current = null
      }
    },
    [ref],
  )

  useLayoutEffect(() => {
    const node = selectRef.current
    // Controlled values and option children can change on any commit.
    if (readOnly && node) selected.current = readSelection(node)
  })

  useLayoutEffect(() => {
    const node = selectRef.current
    const form = node?.form
    if (!readOnly || !node || !form) return

    let active = true
    const onReset = () =>
      queueMicrotask(() => {
        // The reset event fires before the browser restores the defaults.
        if (active) selected.current = readSelection(node)
      })

    form.addEventListener("reset", onReset)
    return () => {
      active = false
      form.removeEventListener("reset", onReset)
    }
  }, [readOnly, selectProps.form])

  return (
    <select
      aria-invalid={ariaAttr(field?.invalid)}
      disabled={field?.disabled}
      required={field?.required}
      {...styleAttributes}
      {...selectProps}
      id={field?.id ?? rest.id}
      ref={attachRef}
      size={visibleRows}
      aria-describedby={cx(field?.describedBy, rest["aria-describedby"])}
      aria-readonly={ariaAttr(readOnly)}
      onChange={(event) => {
        if (readOnly) {
          // Some assistive technologies change selection without a pointer or key event.
          Array.from(event.currentTarget.options).forEach((option, index) => {
            option.selected = selected.current[index] ?? false
          })
          return
        }

        onChange?.(event)
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        const pickerArrow = event.key === "ArrowDown" || event.key === "ArrowUp"
        if (
          !readOnly ||
          event.ctrlKey ||
          event.metaKey ||
          (event.altKey && !pickerArrow) ||
          event.key === "Tab" ||
          event.key === "Escape"
        )
          return

        event.preventDefault()
        selected.current = readSelection(event.currentTarget)
      }}
      onPointerDown={(event) => {
        onPointerDown?.(event)
        if (readOnly && !event.defaultPrevented && event.button === 0) {
          event.preventDefault()
          selected.current = readSelection(event.currentTarget)
          event.currentTarget.focus()
        }
      }}
    />
  )
}
