import { a11y, render, screen } from "#test"
import { Button } from "./button"

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

  test("has no accessibility violations", async () => {
    await a11y(<Button>Save</Button>)
  })
})
