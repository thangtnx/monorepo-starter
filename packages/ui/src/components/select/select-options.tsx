"use client"

import type { ReactNode } from "react"
import type { SelectGroupProps } from "./select-group"
import type { SelectOptionProps } from "./select-option"
import { isValidElement } from "react"
import { selectChildren, SelectGroup } from "./select-group"
import { SelectLabel } from "./select-label"
import { SelectOption } from "./select-option"
import { SelectSeparator } from "./select-separator"

export interface SelectItem {
  /** The visible label. */
  label: ReactNode
  /** The unique submitted value. */
  value: string
  /**
   * Prevents selection of this item.
   *
   * @default false
   */
  disabled?: boolean
  /** Plain text for typeahead when the label contains a custom component. */
  textValue?: string
}

export interface SelectItemGroup {
  /** The options in the group. */
  items: readonly SelectItem[]
  /** The group heading. */
  label: ReactNode
  /**
   * Prevents selection of all options in the group.
   *
   * @default false
   */
  disabled?: boolean
}

export interface SelectOptionEntry extends SelectItem {
  id: string
  searchText: string
}

function textFrom(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(textFrom).join("")
  if (isValidElement<{ children?: ReactNode }>(node))
    return textFrom(node.props.children)
  return ""
}

function itemOption({ label, ...item }: SelectItem) {
  return (
    <SelectOption key={item.value} {...item}>
      {label}
    </SelectOption>
  )
}

export function renderItems(items: readonly (SelectItem | SelectItemGroup)[]) {
  return items.map((item, index) =>
    "items" in item ? (
      <SelectGroup key={index} disabled={item.disabled} label={item.label}>
        {item.items.map(itemOption)}
      </SelectGroup>
    ) : (
      itemOption(item)
    ),
  )
}

const warned = new Set<string>()

function warnOnce(message: string) {
  if (
    typeof process === "undefined" ||
    process.env.NODE_ENV === "production" ||
    warned.has(message)
  )
    return
  warned.add(message)
  console.warn(`Select: ${message}`)
}

export function getSelectOptions(children: ReactNode, listboxId: string) {
  const options = new Map<string, SelectOptionEntry>()

  function visit(nodes: ReactNode, groupDisabled = false) {
    for (const child of selectChildren(nodes))
      if (
        isValidElement<SelectGroupProps>(child) &&
        child.type === SelectGroup
      ) {
        visit(child.props.children, groupDisabled || child.props.disabled)
      } else if (
        isValidElement<SelectOptionProps>(child) &&
        child.type === SelectOption
      ) {
        const { children: label, disabled, textValue, value } = child.props
        if (options.has(value))
          warnOnce(`duplicate option value "${value}"; only the last is used.`)
        options.set(value, {
          id: `${listboxId}-option-${options.size}`,
          disabled: groupDisabled || disabled,
          label,
          searchText: (textValue ?? textFrom(label)).trim().toLocaleLowerCase(),
          value,
        })
      } else if (
        isValidElement(child) &&
        typeof child.type !== "string" &&
        child.type !== SelectLabel &&
        child.type !== SelectSeparator
      ) {
        warnOnce(
          "children must be Select.Option or Select.Group elements; options inside other components are not registered and do not render.",
        )
      }
  }

  visit(children)
  return options
}
