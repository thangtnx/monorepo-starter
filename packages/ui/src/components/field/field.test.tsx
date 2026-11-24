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

  test("replaces the hint with the error and marks the control invalid", () => {
    render(
      <Field error="Enter 10 digits." hint="Your mobile number." label="Phone">
        <Input type="tel" />
      </Field>,
    )

    const input = screen.getByRole("textbox", { name: "Phone" })

    expect(input).toBeInvalid()
    expect(input).toHaveAccessibleDescription("Enter 10 digits.")
    expect(screen.queryByText("Your mobile number.")).not.toBeInTheDocument()
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
