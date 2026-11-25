"use client"

import { useCallback, useState } from "react"

export type PaginationRangeItem = "dots" | number

export interface PaginationRangeOptions {
  /** Current 1-based active page. */
  page: number
  /** Total number of pages. */
  total: number
  /** Number of pages always visible at the start and end. @default 1 */
  boundaries?: number
  /** Number of sibling pages shown on each side of the active page. @default 1 */
  siblings?: number
}

export interface UsePaginationProps {
  /** Total number of pages. */
  total: number
  /**
   * Number of boundary pages anchored at the start and end.
   *
   * @default 1
   */
  boundaries?: number
  /**
   * Initial page when uncontrolled.
   *
   * @default 1
   */
  defaultPage?: number
  /** Controlled 1-based active page. */
  page?: number
  /**
   * Number of siblings rendered around the current page.
   *
   * @default 1
   */
  siblings?: number
  /** Invoked when the active page changes. */
  onChange?: (page: number) => void
}

const range = (start: number, end: number) =>
  end >= start
    ? Array.from({ length: end - start + 1 }, (_, index) => start + index)
    : []

const clampPage = (value: number, total: number) =>
  Math.min(Math.max(1, total), Math.max(1, Math.floor(value)))

/** Computes page numbers and ellipsis placeholders for a pagination bar. */
export function getPaginationRange({
  boundaries = 1,
  page,
  siblings = 1,
  total,
}: PaginationRangeOptions): PaginationRangeItem[] {
  const safeTotal = Math.max(1, Math.floor(total))
  const safeBoundaries = Math.max(0, Math.floor(boundaries))
  const safeSiblings = Math.max(0, Math.floor(siblings))
  const current = clampPage(page, safeTotal)

  const totalNumbers = safeSiblings * 2 + 3 + safeBoundaries * 2
  if (safeTotal <= totalNumbers) return range(1, safeTotal)

  const leftSibling = Math.max(current - safeSiblings, safeBoundaries + 1)
  const rightSibling = Math.min(
    current + safeSiblings,
    safeTotal - safeBoundaries,
  )

  const showLeftDots = leftSibling > safeBoundaries + 2
  const showRightDots = rightSibling < safeTotal - safeBoundaries - 1

  if (!showLeftDots && showRightDots) {
    const leftCount = 2 * safeSiblings + safeBoundaries + 2
    const leftItems = range(1, leftCount)
    if (safeBoundaries === 0) return [...leftItems, "dots"]
    return [
      ...leftItems,
      "dots",
      ...range(safeTotal - safeBoundaries + 1, safeTotal),
    ]
  }

  if (showLeftDots && !showRightDots) {
    const rightCount = 2 * safeSiblings + safeBoundaries + 2
    const rightItems = range(safeTotal - rightCount + 1, safeTotal)
    if (safeBoundaries === 0) return ["dots", ...rightItems]
    return [...range(1, safeBoundaries), "dots", ...rightItems]
  }

  const middle = range(leftSibling, rightSibling)
  if (safeBoundaries === 0) return middle

  const startBoundary = range(1, safeBoundaries)
  const endBoundary = range(safeTotal - safeBoundaries + 1, safeTotal)
  return [...startBoundary, "dots", ...middle, "dots", ...endBoundary]
}

/** Manages active page state and navigation helpers for Pagination. */
export function usePagination({
  boundaries = 1,
  defaultPage = 1,
  page,
  siblings = 1,
  total,
  onChange,
}: UsePaginationProps) {
  const safeTotal = Math.max(1, Math.floor(total))
  const [uncontrolledPage, setUncontrolledPage] = useState(() =>
    clampPage(defaultPage, safeTotal),
  )
  const activePage = clampPage(page ?? uncontrolledPage, safeTotal)

  const setPage = useCallback(
    (next: number) => {
      const target = clampPage(next, safeTotal)
      if (target === activePage) return
      if (page === undefined) setUncontrolledPage(target)
      onChange?.(target)
    },
    [activePage, onChange, page, safeTotal],
  )

  const first = useCallback(() => setPage(1), [setPage])
  const last = useCallback(() => setPage(safeTotal), [safeTotal, setPage])
  const previous = useCallback(
    () => setPage(activePage - 1),
    [activePage, setPage],
  )
  const next = useCallback(() => setPage(activePage + 1), [activePage, setPage])

  const items = getPaginationRange({
    boundaries,
    page: activePage,
    siblings,
    total: safeTotal,
  })

  return {
    first,
    last,
    next,
    page: activePage,
    previous,
    range: items,
    setPage,
    total: safeTotal,
  }
}
