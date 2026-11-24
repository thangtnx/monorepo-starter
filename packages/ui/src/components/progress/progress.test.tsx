// cspell:words Avancement cours
import { a11y, render, screen } from "#test"
import { createCss } from "../../core"
import { theme } from "../../theme"
import { Progress } from "./progress"
import { progressStyle } from "./progress.style"

describe("progress", () => {
  test("clamps values and sizes the range relative to the configured bounds", () => {
    const { rerender } = render(
      <Progress
        aria-label="Upload"
        max={60}
        min={20}
        value={30}
        valueText={(value) => `${value} MB`}
        rangeProps={{ id: "range" }}
      />,
    )
    const bar = screen.getByRole("progressbar", { name: "Upload" })
    expect(bar).toHaveAttribute("aria-valuemin", "20")
    expect(bar).toHaveAttribute("aria-valuemax", "60")
    expect(bar).toHaveAttribute("aria-valuenow", "30")
    expect(bar).toHaveAttribute("aria-valuetext", "30 MB")
    expect(document.getElementById("range")).toHaveAttribute("width", "25%")
    rerender(<Progress aria-label="Upload" max={60} min={20} value={90} />)
    expect(bar).toHaveAttribute("aria-valuenow", "60")
    rerender(<Progress aria-label="Upload" value={null} />)
    expect(bar).toHaveAttribute("data-indeterminate", "true")
    expect(bar).not.toHaveAttribute("aria-valuenow")
  })

  test("applies a duration token through a custom property and retains a stylesheet fallback", () => {
    render(<Progress duration="slower" indeterminate />)
    expect(
      screen
        .getByRole("progressbar")
        .style.getPropertyValue("--progress-duration"),
    ).toBe("var(--durations-slower)")
    const css = createCss(theme, { progress: progressStyle })
    expect(css).toContain("var(--progress-duration, 1s)")
  })

  test("has reduced-motion styles and an accessible name without a caller label", async () => {
    const css = createCss(theme, { progress: progressStyle })
    expect(css).toMatch(
      /prefers-reduced-motion: reduce[^}]+ui-progress-fill[^}]+animation-name: none/,
    )
    expect(css).toMatch(
      /prefers-reduced-motion: reduce[^}]+ui-progress-stripes[^}]+animation-name: none/,
    )
    expect(css).toMatch(
      /prefers-reduced-motion: reduce[^}]+ui-progress-fill[^}]+opacity: 0.35;[^}]+transform: scaleX\(4\)/,
    )
    await a11y(<Progress indeterminate />)
    expect(
      screen.getByRole("progressbar", { name: "Progress" }),
    ).toHaveAttribute("aria-valuetext", "In progress")
  })

  test.each(["striped", "animated"] as const)(
    "draws a stripe pattern for %s",
    (mode) => {
      const { container } = render(
        <Progress {...{ [mode]: true }} value={40} />,
      )
      expect(screen.getByRole("progressbar")).toHaveAttribute(
        `data-${mode}`,
        "true",
      )
      const pattern = container.querySelector("pattern")
      expect(pattern).toHaveAttribute("patternUnits", "userSpaceOnUse")
      expect(container.querySelector(".ui-progress-stripes")).toHaveAttribute(
        "fill",
        `url(#${pattern?.id})`,
      )
    },
  )

  test("accepts localized indeterminate text and prioritizes an external label", () => {
    const { rerender } = render(
      <Progress
        defaultLabel="Avancement"
        indeterminate
        indeterminateText="En cours"
      />,
    )
    expect(
      screen.getByRole("progressbar", { name: "Avancement" }),
    ).toHaveAttribute("aria-valuetext", "En cours")
    rerender(
      <>
        <span id="upload-label">Upload</span>
        <Progress aria-labelledby="upload-label" defaultLabel="Avancement" />
      </>,
    )
    expect(
      screen.getByRole("progressbar", { name: "Upload" }),
    ).not.toHaveAttribute("aria-label")
  })
})
