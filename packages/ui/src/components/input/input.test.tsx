import { a11y, render, screen } from "#test"
import { Input } from "./input"

describe("<Input />", () => {
  test("renders a text box with the default size", () => {
    render(<Input aria-label="Search" />)

    const input = screen.getByRole("textbox", { name: "Search" })

    expect(input).toHaveClass("ui-input")
    expect(input).toHaveAttribute("data-size", "md")
    expect(input).not.toHaveAttribute("aria-describedby")
  })

  test("accepts typed text", async () => {
    const { user } = render(<Input aria-label="Name" />)

    await user.type(screen.getByRole("textbox", { name: "Name" }), "Anna")

    expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue("Anna")
  })

  test("keeps its own description outside a field", () => {
    render(
      <>
        <Input aria-describedby="note" aria-label="Code" />
        <span id="note">Six digits</span>
      </>,
    )

    expect(
      screen.getByRole("textbox", { name: "Code" }),
    ).toHaveAccessibleDescription("Six digits")
  })

  test("has no accessibility violations", async () => {
    await a11y(<Input type="email" size="lg" aria-label="Email" />)
  })
})
