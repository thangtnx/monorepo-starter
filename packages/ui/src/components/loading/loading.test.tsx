import { use } from "react"
import { a11y, render, screen } from "#test"
import { createCss } from "../../core"
import { theme } from "../../theme"
import { Loading } from "./index"
import { loadingStyle } from "./loading.style"

describe("loading", () => {
  test.each(Loading.schemes)("renders and names the %s indicator", (scheme) => {
    render(<Loading.Indicator aria-label="Saving" scheme={scheme} />)
    expect(screen.getByRole("img", { name: "Saving" })).toHaveAttribute(
      "data-indicator",
      scheme,
    )
  })

  test("has reduced-motion styling and supports a decorative indicator", async () => {
    const css = createCss(theme, { loading: loadingStyle })
    expect(css).toMatch(
      /prefers-reduced-motion: reduce[^}]+ui-loading[^}]+animation-name: none/,
    )
    await a11y(
      <>
        <Loading.Dots />
        <Loading.Oval decorative />
      </>,
    )
    expect(screen.getAllByRole("img")).toHaveLength(1)
  })

  test("shows the configured fallback while Suspense has pending content", () => {
    const pending = new Promise<never>(() => {})
    function PendingContent() {
      return use(pending)
    }

    render(
      <Loading.Suspense
        loadingScheme="grid"
        loadingProps={{ "aria-label": "Preparing preview" }}
      >
        <PendingContent />
      </Loading.Suspense>,
    )
    expect(screen.getByRole("status")).toContainElement(
      screen.getByRole("img", { name: "Preparing preview" }),
    )
    expect(screen.getByRole("img")).toHaveAttribute("data-indicator", "grid")
  })

  test("renders ready content without a loading indicator", () => {
    render(
      <Loading.Suspense>
        <p>Preview ready</p>
      </Loading.Suspense>,
    )
    expect(screen.getByText("Preview ready")).toBeVisible()
    expect(screen.queryByRole("status")).not.toBeInTheDocument()
  })
})
