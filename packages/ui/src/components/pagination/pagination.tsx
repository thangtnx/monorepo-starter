"use client"

import type { ComponentProps } from "react"
import type { ComponentStyleProps } from "../../core/define"
import type { UsePaginationProps } from "./use-pagination"
import { splitStyleProps } from "../../core/split-style-props"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Ellipsis,
  Icon,
} from "../icon"
import { paginationCopy } from "./pagination-config"
import { paginationStyle } from "./pagination.style"
import { usePagination } from "./use-pagination"

export interface PaginationProps
  extends
    Omit<ComponentProps<"nav">, "children" | "color" | "onChange">,
    ComponentStyleProps<typeof paginationStyle>,
    UsePaginationProps {
  /**
   * Disables all pagination controls.
   *
   * @default false
   */
  disabled?: boolean
  /**
   * Renders previous and next step controls.
   *
   * @default true
   */
  withControls?: boolean
  /**
   * Renders first and last page jump controls.
   *
   * @default false
   */
  withEdges?: boolean
}

/** Displays page links, truncation indicators, and step controls. */
export function Pagination({
  "aria-label": ariaLabel,
  boundaries = 1,
  defaultPage = 1,
  disabled = false,
  page,
  siblings = 1,
  total,
  withControls = true,
  withEdges = false,
  onChange,
  ...props
}: PaginationProps) {
  const [styleAttributes, rest] = splitStyleProps(
    "pagination",
    paginationStyle,
    props,
  )
  const {
    first,
    last,
    next,
    page: activePage,
    previous,
    range,
    setPage,
    total: safeTotal,
  } = usePagination({
    boundaries,
    defaultPage,
    page,
    siblings,
    total,
    onChange,
  })
  const atStart = disabled || activePage <= 1
  const atEnd = disabled || activePage >= safeTotal

  return (
    <nav
      {...styleAttributes}
      {...rest}
      aria-label={ariaLabel ?? paginationCopy.navigation}
    >
      <ul>
        {withEdges && (
          <li>
            <button
              type="button"
              aria-label={paginationCopy.first}
              data-part="item"
              disabled={atStart}
              onClick={first}
            >
              <Icon as={ChevronsLeft} />
            </button>
          </li>
        )}
        {withControls && (
          <li>
            <button
              type="button"
              aria-label={paginationCopy.previous}
              data-part="item"
              disabled={atStart}
              onClick={previous}
            >
              <Icon as={ChevronLeft} />
            </button>
          </li>
        )}
        {range.map((entry, index) => {
          if (entry === "dots")
            return (
              <li key={`dots-${index}`} aria-hidden="true">
                <span data-part="ellipsis">
                  <Icon as={Ellipsis} />
                </span>
              </li>
            )

          const current = entry === activePage
          return (
            <li key={entry}>
              <button
                type="button"
                aria-current={current ? "page" : undefined}
                aria-label={paginationCopy.page(entry)}
                data-part="item"
                disabled={disabled}
                onClick={() => setPage(entry)}
              >
                {entry}
              </button>
            </li>
          )
        })}
        {withControls && (
          <li>
            <button
              type="button"
              aria-label={paginationCopy.next}
              data-part="item"
              disabled={atEnd}
              onClick={next}
            >
              <Icon as={ChevronRight} />
            </button>
          </li>
        )}
        {withEdges && (
          <li>
            <button
              type="button"
              aria-label={paginationCopy.last}
              data-part="item"
              disabled={atEnd}
              onClick={last}
            >
              <Icon as={ChevronsRight} />
            </button>
          </li>
        )}
      </ul>
    </nav>
  )
}
