import { a11y, render, screen } from "#test"
import { Input } from "../input/input"
import { Field } from "./field"

describe("<Field />", () => {
  test("labels the control and describes it with the hint", () => {
    render(
      <Field hint="We call you within a day." label="Phone">
        <Input type="tel" />
      </Field>,
    )

    const input = screen.getByRole("textbox", { name: "Phone" })

    expect(input).toHaveAccessibleDescription("We call you within a day.")
    expect(input).not.toHaveAttribute("aria-invalid")
  })

  test("announces a validation error and replaces the hint", () => {
    const { rerender } = render(
      <Field hint="Your mobile number." label="Phone">
        <Input type="tel" />
      </Field>,
    )

    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    rerender(
      <Field error="Enter 10 digits." hint="Your mobile number." label="Phone">
        <Input type="tel" />
      </Field>,
    )

    const input = screen.getByRole("textbox", { name: "Phone" })

    expect(input).toBeInvalid()
    expect(screen.getByRole("alert")).toHaveTextContent("Enter 10 digits.")
    expect(input).toHaveAccessibleDescription("Enter 10 digits.")
    expect(screen.queryByText("Your mobile number.")).not.toBeInTheDocument()
  })

  test("uses the field id for the control, label and hint", () => {
    render(
      <Field id="phone" hint="Include the area code." label="Phone">
        <Input id="custom-phone" type="tel" />
      </Field>,
    )

    const input = screen.getByRole("textbox", { name: "Phone" })
    expect(input).toHaveAttribute("id", "phone")
    expect(input).toHaveAttribute("aria-describedby", "phone-message")
    expect(input).toHaveAccessibleDescription("Include the area code.")
  })

  test("labels a wrapped control without reusing the wrapper id", () => {
    const { container } = render(
      <Field label="Phone">
        <div id="row">
          <Input type="tel" />
        </div>
      </Field>,
    )

    const input = screen.getByRole("textbox", { name: "Phone" })
    expect(input).toHaveAttribute("id")
    expect(input.id).not.toBe("row")
    expect(container.querySelectorAll('[id="row"]')).toHaveLength(1)
  })

  test("passes required, disabled and read-only to the control", () => {
    render(
      <Field id="name" disabled label="Name" readOnly required>
        <Input />
      </Field>,
    )

    const input = screen.getByRole("textbox", { name: "Name" })

    expect(input).toHaveAttribute("id", "name")
    expect(input).toBeRequired()
    expect(input).toBeDisabled()
    expect(input).toHaveAttribute("readonly")
  })

  test("has no accessibility violations", async () => {
    await a11y(
      <Field error="Enter your name." label="Name" required>
        <Input />
      </Field>,
    )
  })
})
