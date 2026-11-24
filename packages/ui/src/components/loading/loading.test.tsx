import { use } from "react"
import { a11y, render, screen } from "#test"
import { createCss } from "../../core"
import { theme } from "../../theme"
import { Loading, LoadingPropsContext, loadingSchemes } from "./index"
import { loadingStyle } from "./loading.style"

describe("loading", () => {
  test.each(Object.entries(loadingSchemes))(
    "draws and names the %s indicator",
    async (scheme, Indicator) => {
      await a11y(<Indicator aria-label="Saving" />)
      const indicator = screen.getByRole("img", { name: "Saving" })
      expect(indicator).toHaveClass(`ui-loading-${scheme}`)
      expect(indicator.firstElementChild).toBeInTheDocument()
      expect(indicator).not.toHaveAttribute("data-indicator")
    },
  )

  test("sets token-backed custom properties and retains static fallbacks", () => {
    render(
      <LoadingPropsContext
        value={{ duration: "slow", secondaryColor: "info.solid" }}
      >
        <Loading.Oval aria-label="Saving" dur="1.2s" />
        <Loading.Oval aria-label="Uploading" />
      </LoadingPropsContext>,
    )
    const saving = screen.getByRole("img", { name: "Saving" })
    const uploading = screen.getByRole("img", { name: "Uploading" })
    expect(saving.style.getPropertyValue("--loading-duration")).toBe("1.2s")
    expect(uploading.style.getPropertyValue("--loading-duration")).toBe(
      "var(--durations-slow)",
    )
    expect(uploading.style.getPropertyValue("--loading-secondary")).toBe(
      "var(--colors-info-solid)",
    )
    const css = createCss(theme, { loading: loadingStyle })
    expect(css).toContain("var(--loading-duration, 1s)")
    expect(css).toContain(
      "stroke: var(--loading-secondary, color-mix(in srgb, currentColor 50%, transparent))",
    )
  })

  test("has reduced-motion styles and supports a decorative indicator", async () => {
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

  test("flashes each circle for the first quarter of its cycle and keeps one filled without motion", () => {
    render(<Loading.Circles />)
    const indicator = screen.getByRole("img")
    const circles = indicator.querySelectorAll("circle")
    const [first] = circles
    expect(
      Array.from(circles, (circle) => circle.getAttribute("fill-opacity")),
    ).toStrictEqual(["1", "0", "0", "0", "0", "0", "0", "0"])
    expect(first?.style.getPropertyValue("--loading-animation")).toContain(
      "linear(1, 0 12.5%, 1 25%, 1)",
    )
    expect(first?.style.getPropertyValue("--loading-flash-fill")).toBe("0")
    expect(indicator.style.getPropertyValue("--loading-animation")).toContain(
      "linear(0, 1 12.5%, 0 25%, 0)",
    )
    const css = createCss(theme, { loading: loadingStyle })
    expect(css).toMatch(/\.ui-loading\s*\{[^}]*--loading-flash-fill: 1;/)
    expect(css).toMatch(
      /@keyframes ui-loading-circle-flash\s*\{\s*to\s*\{\s*fill-opacity: var\(--loading-flash-fill\);/,
    )
  })

  test("preserves context and local classes on the same indicator", () => {
    render(
      <LoadingPropsContext value={{ className: "context-class" }}>
        <Loading.Oval className="local-class" />
      </LoadingPropsContext>,
    )
    expect(screen.getByRole("img")).toHaveClass(
      "ui-loading-oval",
      "context-class",
      "local-class",
    )
  })

  test("shows the configured fallback while Suspense has pending content", async () => {
    const pending = new Promise<never>(() => {})
    function PendingContent() {
      return use(pending)
    }

    await a11y(
      <Loading.Suspense
        loadingScheme="grid"
        loadingProps={{ "aria-label": "Preparing preview" }}
      >
        <PendingContent />
      </Loading.Suspense>,
    )
    const indicator = screen.getByRole("img", { name: "Preparing preview" })
    expect(screen.getByRole("status")).toContainElement(indicator)
    expect(indicator).toHaveClass("ui-loading-grid")
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
