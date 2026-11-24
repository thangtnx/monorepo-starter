import type { ComponentProps } from "react"
import { a11y, render, screen } from "#test"
import { componentStyles } from "../../component-styles"
import { createCss } from "../../core"
import { theme } from "../../theme"
import { Check, Icon, Info } from "./index"

function Diamond(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 16 16" {...props}>
      <polygon points="8,1 15,8 8,15 1,8" />
    </svg>
  )
}

describe("Icon", () => {
  test("exposes a labelled icon and resolves its theme tokens", async () => {
    await a11y(
      <Icon as={Info} size="5" aria-label="Information" color="info.fg" />,
    )
    const icon = screen.getByRole("img", { name: "Information" })
    expect(icon).toHaveAttribute("stroke", "var(--colors-info-fg)")
    expect(icon).toHaveAttribute("height", "var(--sizes-5)")
    expect(icon).toHaveAttribute("width", "var(--sizes-5)")
    expect(icon).not.toHaveAttribute("aria-hidden")
  })

  test("hides decorative icons and accepts an external label", () => {
    render(
      <>
        <button type="button">
          <Icon as={Check} /> Confirm
        </button>
        <span id="details-label">Details</span>
        <Icon as={Info} aria-labelledby="details-label" />
        <Icon aria-label="Custom shape" color="warning.fg">
          <circle cx="8" cy="8" r="4" />
        </Icon>
      </>,
    )
    expect(
      screen.getByRole("button", { name: "Confirm" }).querySelector("svg"),
    ).toHaveAttribute("aria-hidden", "true")
    expect(screen.getByRole("img", { name: "Details" })).toBeInTheDocument()
    const custom = screen.getByRole("img", { name: "Custom shape" })
    expect(custom).toHaveAttribute("color", "var(--colors-warning-fg)")
    expect(custom).toHaveAttribute("fill", "currentColor")
  })

  test("accepts custom SVG components and applies the registered layout style", () => {
    render(<Icon as={Diamond} size={16} aria-label="Diamond" />)
    const icon = screen.getByRole("img", { name: "Diamond" })
    expect(icon).toHaveClass("ui-icon")
    expect(icon).toHaveAttribute("data-icon", "")
    expect(icon).toHaveAttribute("width", "16")
    expect(icon).toHaveAttribute("viewBox", "0 0 16 16")
    expect(icon.querySelector("polygon")).toBeInTheDocument()

    const css = createCss(theme, componentStyles)
    const rule = css.match(/\.ui-icon\s*\{([^}]+)\}/)?.[1]
    expect(rule).toContain("display: inline-block;")
    expect(rule).toContain("flex-shrink: 0;")
    expect(rule).toContain("line-height: 1em;")
    expect(rule).toContain("vertical-align: middle;")
  })

  test("omits the image role when a named icon is explicitly hidden", () => {
    const { container } = render(
      <Icon as={Info} aria-hidden aria-label="Info" />,
    )
    const icon = container.querySelector("svg")
    expect(icon).toHaveAttribute("aria-hidden", "true")
    expect(icon).not.toHaveAttribute("role")
  })
})
