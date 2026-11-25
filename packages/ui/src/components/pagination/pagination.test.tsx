import { a11y, render, screen } from "#test"
import { getPaginationRange, Pagination } from "./index"

describe("getPaginationRange", () => {
  test("returns all pages without dots when total fits within slots", () => {
    expect(
      getPaginationRange({ boundaries: 1, page: 1, siblings: 1, total: 5 }),
    ).toStrictEqual([1, 2, 3, 4, 5])
  })

  test("places ellipsis at start, end, or both sides for large totals", () => {
    expect(
      getPaginationRange({ boundaries: 1, page: 1, siblings: 1, total: 10 }),
    ).toStrictEqual([1, 2, 3, 4, 5, "dots", 10])
    expect(
      getPaginationRange({ boundaries: 1, page: 5, siblings: 1, total: 10 }),
    ).toStrictEqual([1, "dots", 4, 5, 6, "dots", 10])
    expect(
      getPaginationRange({ boundaries: 1, page: 10, siblings: 1, total: 10 }),
    ).toStrictEqual([1, "dots", 6, 7, 8, 9, 10])
  })

  test("honors custom siblings and boundaries without hiding a single page behind dots", () => {
    expect(
      getPaginationRange({ boundaries: 2, page: 6, siblings: 2, total: 20 }),
    ).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, "dots", 19, 20])
    expect(
      getPaginationRange({ boundaries: 2, page: 8, siblings: 2, total: 20 }),
    ).toStrictEqual([1, 2, "dots", 6, 7, 8, 9, 10, "dots", 19, 20])
  })
})

describe("<Pagination />", () => {
  test("navigates across pages and updates disabled step/edge states", async () => {
    const onChange = vi.fn()
    const { user } = render(
      <Pagination total={10} withEdges onChange={onChange} />,
    )

    expect(screen.getByRole("navigation", { name: "Pagination" })).toHaveClass(
      "ui-pagination",
    )
    expect(screen.getByRole("button", { name: "First page" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Page 1" })).toHaveAttribute(
      "aria-current",
      "page",
    )

    await user.click(screen.getByRole("button", { name: "Next page" }))
    expect(onChange).toHaveBeenCalledWith(2)
    expect(screen.getByRole("button", { name: "Page 2" })).toHaveAttribute(
      "aria-current",
      "page",
    )
    expect(screen.getByRole("button", { name: "First page" })).toBeEnabled()

    await user.click(screen.getByRole("button", { name: "Last page" }))
    expect(onChange).toHaveBeenLastCalledWith(10)
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Last page" })).toBeDisabled()
  })

  test("supports controlled page updates and disabled state", async () => {
    const onChange = vi.fn()
    const { rerender, user } = render(
      <Pagination page={3} total={8} onChange={onChange} />,
    )

    await user.click(screen.getByRole("button", { name: "Page 4" }))
    expect(onChange).toHaveBeenCalledWith(4)
    expect(screen.getByRole("button", { name: "Page 3" })).toHaveAttribute(
      "aria-current",
      "page",
    )

    rerender(<Pagination disabled page={4} total={8} onChange={onChange} />)
    expect(screen.getByRole("button", { name: "Page 4" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled()
  })

  test("has no accessibility violations", async () => {
    await a11y(<Pagination defaultPage={4} total={10} withEdges />)
  })
})
