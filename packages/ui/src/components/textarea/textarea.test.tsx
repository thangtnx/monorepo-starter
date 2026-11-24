import { a11y, render, screen } from "#test"
import { Field } from "../field/field"
import { Textarea } from "./textarea"

describe("<Textarea />", () => {
  test("accepts multiline text with native form props and styled sizes", async () => {
    const { user } = render(
      <Textarea name="notes" size="lg" aria-label="Notes" rows={4} />,
    )
    const textarea = screen.getByRole("textbox", { name: "Notes" })

    await user.type(textarea, "First line{Enter}Second line")

    expect(textarea).toHaveValue("First line\nSecond line")
    expect(textarea).toHaveAttribute("rows", "4")
    expect(textarea).toHaveAttribute("data-size", "lg")
    expect(textarea).toHaveClass("ui-textarea")
  })

  test("uses the Field id, descriptions and native states", () => {
    render(
      <>
        <Field
          id="notes"
          disabled
          error="Add more detail."
          label="Notes"
          readOnly
          required
        >
          <Textarea id="custom-notes" aria-describedby="limit" />
        </Field>
        <span id="limit">Maximum 500 characters.</span>
      </>,
    )

    const textarea = screen.getByRole("textbox", { name: "Notes" })
    expect(textarea).toHaveAttribute("id", "notes")
    expect(textarea).toHaveAccessibleDescription(
      "Add more detail. Maximum 500 characters.",
    )
    expect(textarea).toHaveAttribute("aria-invalid", "true")
    expect(textarea).toHaveAttribute("readonly")
    expect(textarea).toBeDisabled()
    expect(textarea).toBeRequired()
  })

  test("has no accessibility violations", async () => {
    await a11y(
      <Field hint="Use one line per item." label="Notes">
        <Textarea />
      </Field>,
    )
  })
})
