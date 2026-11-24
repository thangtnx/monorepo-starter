import { a11y, render, screen } from "#test"
import { Field } from "../field/field"
import { Radio } from "./radio"

describe("<Radio />", () => {
  test("renders a native radio and applies its style props", async () => {
    const { user } = render(
      <Radio
        name="method"
        colorScheme="info"
        size="lg"
        aria-label="Delivery"
        value="delivery"
      />,
    )
    const radio = screen.getByRole("radio", { name: "Delivery" })

    await user.click(radio)

    expect(radio).toBeChecked()
    expect(radio).toHaveAttribute("type", "radio")
    expect(radio).toHaveAttribute("data-size", "lg")
    expect(radio).toHaveAttribute("data-scheme", "info")
  })

  test("uses Field state and preserves an unchecked read-only option", async () => {
    const { user } = render(
      <Field
        id="delivery"
        error="Choose delivery."
        label="Delivery"
        readOnly
        required
      >
        <Radio />
      </Field>,
    )

    const radio = screen.getByRole("radio", { name: "Delivery" })
    await user.click(radio)

    expect(radio).toHaveAttribute("id", "delivery")
    expect(radio).toHaveAccessibleDescription("Choose delivery.")
    expect(radio).toHaveAttribute("aria-invalid", "true")
    expect(radio).toBeRequired()
    expect(radio).not.toBeChecked()
  })

  test("has no accessibility violations", async () => {
    await a11y(
      <Field disabled label="Delivery">
        <Radio />
      </Field>,
    )
  })
})
