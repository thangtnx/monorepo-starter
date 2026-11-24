"use client"

import type { ComponentProps, ReactNode } from "react"
import { Children, cloneElement, Fragment, isValidElement, useId } from "react"
import { SelectLabel } from "./select-label"

export interface SelectGroupProps extends Omit<ComponentProps<"div">, "label"> {
  /**
   * Prevents selection of all options inside the group.
   *
   * @default false
   */
  disabled?: boolean
  /** The group heading. A SelectLabel child can also supply the heading. */
  label?: ReactNode
}

export function selectChildren(children: ReactNode): ReactNode[] {
  return Children.toArray(children).flatMap((child) =>
    isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment
      ? selectChildren(child.props.children)
      : [child],
  )
}

export function SelectGroup({
  "aria-label": ariaLabel,
  "aria-labelledby": labelledBy,
  children,
  disabled,
  label,
  ...props
}: SelectGroupProps) {
  const labelId = useId()
  const parts = selectChildren(children)
  const heading = parts.find(
    (part) =>
      isValidElement<ComponentProps<typeof SelectLabel>>(part) &&
      part.type === SelectLabel,
  )
  const headingId =
    label != null
      ? labelId
      : isValidElement<ComponentProps<typeof SelectLabel>>(heading)
        ? (heading.props.id ?? labelId)
        : undefined

  return (
    <div
      {...props}
      aria-disabled={disabled || undefined}
      aria-label={ariaLabel}
      aria-labelledby={labelledBy ?? (ariaLabel ? undefined : headingId)}
      data-part="group"
      role="group"
    >
      {label != null && <SelectLabel id={labelId}>{label}</SelectLabel>}
      {parts.map((part) =>
        part === heading &&
        headingId !== undefined &&
        isValidElement<ComponentProps<typeof SelectLabel>>(part)
          ? cloneElement(part, { id: part.props.id ?? headingId })
          : part,
      )}
    </div>
  )
}
