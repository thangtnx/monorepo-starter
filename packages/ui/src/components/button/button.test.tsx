import { a11y, render, screen } from "#test"
import { createCss } from "../../core"
import { theme } from "../../theme"
import { ChevronDown, Icon, X } from "../icon"
import { Button } from "./button"
import { buttonStyle } from "./button.style"

describe("<Button />", () => {
  test("renders a non-submitting button with the default style", () => {
    render(<Button>Save</Button>)

    const button = screen.getByRole("button", { name: "Save" })

    expect(button).toHaveAttribute("type", "button")
    expect(button).toHaveClass("ui-button")
    expect(button).toHaveAttribute("data-variant", "solid")
    expect(button).toHaveAttribute("data-size", "md")
    expect(button).toHaveAttribute("data-scheme", "primary")
  })

  test("maps style props to attributes and keeps the class name", () => {
    render(
      <Button
        type="submit"
        className="extra"
        colorScheme="danger"
        size="lg"
        variant="outline"
        fullWidth
      >
        Delete
      </Button>,
    )

    const button = screen.getByRole("button", { name: "Delete" })

    expect(button).toHaveClass("ui-button", "extra")
    expect(button).toHaveAttribute("type", "submit")
    expect(button).toHaveAttribute("data-variant", "outline")
    expect(button).toHaveAttribute("data-size", "lg")
    expect(button).toHaveAttribute("data-scheme", "danger")
    expect(button).toHaveAttribute("data-full-width", "true")
  })

  test("calls onClick unless disabled", async () => {
    const onClick = vi.fn()
    const { rerender, user } = render(<Button onClick={onClick}>Send</Button>)

    await user.click(screen.getByRole("button", { name: "Send" }))
    rerender(
      <Button disabled onClick={onClick}>
        Send
      </Button>,
    )
    await user.click(screen.getByRole("button", { name: "Send" }))

    expect(onClick).toHaveBeenCalledOnce()
  })

  test("injects no styles at runtime", () => {
    render(<Button>Save</Button>)

    expect(document.querySelectorAll("style")).toHaveLength(0)
  })

  test("disables a busy button and supports loading text and placement", async () => {
    const onClick = vi.fn()
    const { rerender, user } = render(
      <Button loading onClick={onClick}>
        Save
      </Button>,
    )
    const button = screen.getByRole("button", { name: "Save" })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute("aria-busy", "true")
    expect(button.firstElementChild).toHaveClass("ui-button-loading-indicator")
    const spinner = button.querySelector("svg.ui-loading.lucide")
    expect(spinner).toHaveClass("ui-loading-icon-spinner", "ui-loading-motion")
    expect(spinner).toHaveAttribute("viewBox", "0 0 24 24")
    expect(button.querySelector("svg svg")).not.toBeInTheDocument()
    await user.click(button)
    expect(onClick).not.toHaveBeenCalled()

    rerender(
      <Button loading loadingPlacement="end" loadingText="Saving">
        Save
      </Button>,
    )
    expect(
      screen.getByRole("button", { name: "Saving" }).lastElementChild,
    ).toHaveClass("ui-button-loading-indicator")
    expect(screen.queryByRole("img")).not.toBeInTheDocument()
  })

  test("allows built-in indicators to be named and sized", () => {
    render(
      <Button
        loading
        loadingIcon="dots"
        loadingProps={{
          "aria-label": "Saving settings",
          decorative: false,
          height: 24,
          width: 24,
        }}
      >
        Save
      </Button>,
    )
    const indicator = screen.getByRole("img", { name: "Saving settings" })
    expect(indicator).toHaveAttribute("viewBox", "0 0 120 30")
    expect(indicator).toHaveAttribute("width", "24")
    expect(indicator).toHaveAttribute("height", "24")
  })

  test("places decorative start and end icons around the label", async () => {
    await a11y(
      <Button endIcon={<Icon as={ChevronDown} />} startIcon={<Icon as={X} />}>
        Edit
      </Button>,
    )
    const button = screen.getByRole("button", { name: "Edit" })
    const label = button.querySelector(".ui-button-loading-label")
    expect(
      label?.firstElementChild?.querySelector(".lucide-x"),
    ).toBeInTheDocument()
    expect(
      label?.lastElementChild?.querySelector(".lucide-chevron-down"),
    ).toBeInTheDocument()
    expect(screen.queryByRole("img")).not.toBeInTheDocument()
  })

  test("overlays custom indicators while keeping the original name accessible", async () => {
    const css = createCss(theme, { button: buttonStyle })
    expect(css).toMatch(
      /\.ui-button\[data-loading-overlay\] > \.ui-button-loading-label\s*\{[^}]*align-items: center;[^}]*display: inline-flex;[^}]*gap: inherit;[^}]*opacity: 0;/,
    )
    expect(css).toMatch(
      /\.ui-button \.ui-button-icon\s*\{[^}]*display: inline-flex;/,
    )
    expect(css).toMatch(
      /\.ui-button\[data-loading-overlay\] > \.ui-button-loading-indicator\s*\{[^}]*position: absolute;/,
    )
    await a11y(
      <Button loading loadingIcon={<span>Working</span>}>
        Save
      </Button>,
    )
    const button = screen.getByRole("button", { name: "Save" })
    expect(button).toHaveAttribute("data-loading-overlay", "true")
    expect(screen.getByText("Working").parentElement).toHaveAttribute(
      "aria-hidden",
      "true",
    )
  })

  test("keeps both icon slots mounted in overlay mode and removes them for loading text", () => {
    const icons = {
      endIcon: <Icon as={ChevronDown} aria-label="Expand" />,
      startIcon: <Icon as={X} aria-label="Cancel" />,
    }
    const { rerender } = render(<Button {...icons}>Edit</Button>)
    const button = screen.getByRole("button", { name: "Edit" })
    const start = button.querySelector<SVGSVGElement>(".lucide-x")
    const end = button.querySelector<SVGSVGElement>(".lucide-chevron-down")

    rerender(
      <Button {...icons} loading>
        Edit
      </Button>,
    )
    const label = button.querySelector(".ui-button-loading-label")
    expect(start).toBeInTheDocument()
    expect(end).toBeInTheDocument()
    expect(label).toContainElement(start)
    expect(label).toContainElement(end)
    expect(screen.getByRole("button", { name: "Edit" })).toBe(button)
    expect(screen.queryByRole("img")).not.toBeInTheDocument()

    rerender(
      <Button {...icons} loading loadingText="Editing">
        Edit
      </Button>,
    )
    expect(start).not.toBeInTheDocument()
    expect(end).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Editing" })).toBe(button)
  })

  test("has no accessibility violations", async () => {
    await a11y(<Button>Save</Button>)
  })
})
