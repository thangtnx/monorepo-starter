import { a11y, render, screen } from "#test"
import { Checkbox } from "../checkbox/checkbox"
import { Field } from "../field/field"
import { Input } from "../input/input"
import { Fieldset } from "./fieldset"

function ContactOptions() {
  return (
    <>
      <label htmlFor="email">Email</label>
      <Checkbox id="email" name="contact" value="email" />
      <label htmlFor="sms">SMS</label>
      <Checkbox id="sms" name="contact" value="sms" />
    </>
  )
}

describe("<Fieldset />", () => {
  test("describes a native checkbox group and preserves individual checkbox labels", async () => {
    const { user } = render(
      <>
        <p id="privacy">You can unsubscribe any time.</p>
        <Fieldset
          aria-describedby="privacy"
          hint="Choose how we can contact you."
          legend="Contact preferences"
        >
          <ContactOptions />
        </Fieldset>
      </>,
    )

    const group = screen.getByRole("group", { name: "Contact preferences" })
    const email = screen.getByRole("checkbox", { name: "Email" })
    const sms = screen.getByRole("checkbox", { name: "SMS" })

    expect(group.tagName).toBe("FIELDSET")
    expect(group).toHaveAccessibleDescription(
      "Choose how we can contact you. You can unsubscribe any time.",
    )
    expect(email).not.toHaveAccessibleDescription()
    expect(sms).not.toHaveAccessibleDescription()
    await user.click(screen.getByText("Email"))
    expect(email).toBeChecked()
    expect(sms).not.toBeChecked()
  })

  test("marks the legend as required and describes the error once on the group", () => {
    render(
      <Fieldset
        error="Choose at least one contact channel."
        hint="Choose how we can contact you."
        legend="Contact preferences"
        required
      >
        <ContactOptions />
      </Fieldset>,
    )

    const group = screen.getByRole("group", { name: "Contact preferences" })
    expect(group.querySelector("legend")).toHaveTextContent(
      "Contact preferences *",
    )
    expect(group).toHaveAccessibleDescription(
      "Choose at least one contact channel.",
    )
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Choose at least one contact channel.",
    )
    expect(screen.queryByText("Choose how we can contact you.")).toBeNull()

    for (const checkbox of screen.getAllByRole("checkbox")) {
      expect(checkbox).toBeInvalid()
      expect(checkbox).not.toBeRequired()
      expect(checkbox).not.toHaveAccessibleDescription()
    }
  })

  test("inherits the group size and preserves each control's explicit props", () => {
    render(
      <Fieldset size="lg" legend="Contact preferences" required>
        <ContactOptions />
        <Field hint="Include the area code." label="Phone">
          <Input />
        </Field>
        <label htmlFor="terms">Terms</label>
        <Checkbox id="terms" size="sm" required />
      </Fieldset>,
    )

    expect(screen.getByRole("checkbox", { name: "Email" })).toHaveAttribute(
      "data-size",
      "lg",
    )
    const phone = screen.getByRole("textbox", { name: "Phone" })
    expect(phone).toHaveAttribute("data-size", "lg")
    expect(phone).toHaveAccessibleDescription("Include the area code.")
    const terms = screen.getByRole("checkbox", { name: "Terms" })
    expect(terms).toHaveAttribute("data-size", "sm")
    expect(terms).toBeRequired()
  })

  test("disables native and design-system controls through the fieldset", async () => {
    const { user } = render(
      <Fieldset disabled legend="Contact preferences">
        <label htmlFor="email">
          Email <Checkbox id="email" disabled={false} />
        </label>
        <label>
          SMS <input type="checkbox" />
        </label>
      </Fieldset>,
    )

    for (const checkbox of screen.getAllByRole("checkbox")) {
      expect(checkbox).toBeDisabled()
      await user.click(checkbox)
      expect(checkbox).not.toBeChecked()
    }
  })

  test("has no accessibility violations", async () => {
    await a11y(
      <Fieldset
        error="Confirm both channels."
        legend="Contact preferences"
        required
      >
        <ContactOptions />
      </Fieldset>,
    )
  })
})
