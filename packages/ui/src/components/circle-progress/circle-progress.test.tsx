import { a11y, render, screen } from "#test"
import { createCss } from "../../core"
import { theme } from "../../theme"
import { circleProgressStyle } from "./circle-progress.style"
import { CircleProgress } from "./index"

describe("circle-progress", () => {
  test("renders a labeled range with custom paint and geometry", () => {
    render(
      <CircleProgress.Root
        aria-label="Upload"
        aria-valuetext="Half uploaded"
        max={50}
        min={10}
        rangeColor="danger.solid"
        thickness={2}
        trackColor="colorScheme.subtle"
        value={30}
        rangeProps={{ id: "range" }}
        trackProps={{ id: "track" }}
      >
        <CircleProgress.Label>50%</CircleProgress.Label>
      </CircleProgress.Root>,
    )
    const bar = screen.getByRole("progressbar", { name: "Upload" })
    expect(bar).toHaveAttribute("aria-valuenow", "30")
    expect(bar).toHaveAttribute("aria-valuetext", "Half uploaded")
    expect(document.getElementById("range")).toHaveAttribute(
      "stroke-dasharray",
      "50 100",
    )
    expect(document.getElementById("range")).toHaveAttribute(
      "stroke",
      "var(--colors-danger-solid, var(--circle-range))",
    )
    expect(document.getElementById("track")).toHaveAttribute(
      "stroke",
      "var(--color-scheme-subtle, var(--circle-track))",
    )
    expect(document.getElementById("track")).toHaveAttribute(
      "stroke-width",
      "2",
    )
    expect(screen.getByText("50%")).toHaveClass("ui-circle-progress-label")
  })

  test("omits the value in indeterminate mode and suppresses motion when requested", async () => {
    const css = createCss(theme, { "circle-progress": circleProgressStyle })
    expect(css).toMatch(
      /prefers-reduced-motion: reduce[^}]+ui-circle-progress-range[^}]+animation-name: none/,
    )
    expect(css).toMatch(
      /prefers-reduced-motion: reduce[^}]+ui-circle-progress-range[^}]+stroke-dasharray: 3 4/,
    )
    await a11y(<CircleProgress.Root value={null} />)
    expect(screen.getByRole("progressbar")).not.toHaveAttribute("aria-valuenow")
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuetext",
      "In progress",
    )
  })
})
