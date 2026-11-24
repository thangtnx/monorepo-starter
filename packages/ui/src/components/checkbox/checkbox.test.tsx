import { a11y, render, screen } from "#test"
import { Field } from "../field/field"
import { Checkbox } from "./checkbox"

describe("<Checkbox />", () => {
  test("exposes native mixed state and supports custom label and indicator props", async () => {
    const mixed = (
      <Checkbox
        checkedIcon="Checked icon"
        indeterminate
        indeterminateIcon="Mixed icon"
        indicatorProps={{ id: "selection-indicator" }}
        inputProps={{ name: "selection" }}
        labelProps={{ id: "selection-label" }}
      >
        Select all
      </Checkbox>
    )
    const { rerender, user } = render(mixed)
    const input = screen.getByRole("checkbox", { name: "Select all" })
    expect(input).toBePartiallyChecked()
    expect(input).toHaveAttribute("name", "selection")
    expect(screen.getByText("Select all")).toHaveAttribute(
      "id",
      "selection-label",
    )
    expect(screen.getByText("Mixed icon").parentElement).toHaveAttribute(
      "id",
      "selection-indicator",
    )
    await user.click(input)
    expect(input).toBePartiallyChecked()
    rerender(<Checkbox checked> Select all </Checkbox>)
    expect(input).toBeChecked()
    expect(input).not.toBePartiallyChecked()
    await a11y(mixed)
  })

  test("toggles by label and keyboard and submits its checked value", async () => {
    const { user } = render(
      <form aria-label="Preferences">
        <Field label="Send updates">
          <Checkbox
            name="updates"
            colorScheme="success"
            size="lg"
            value="yes"
          />
        </Field>
      </form>,
    )

    const checkbox = screen.getByRole("checkbox", { name: "Send updates" })
    await user.click(screen.getByText("Send updates"))
    const form = screen.getByRole<HTMLFormElement>("form", {
      name: "Preferences",
    })
    expect(checkbox).toBeChecked()
    expect(new FormData(form).get("updates")).toBe("yes")
    expect(checkbox).toHaveAttribute("data-scheme", "success")
    expect(checkbox).toHaveAttribute("data-size", "lg")

    await user.keyboard(" ")
    expect(checkbox).not.toBeChecked()
    expect(new FormData(form).get("updates")).toBeNull()
  })

  test("keeps a read-only checkbox focusable without changing it", async () => {
    const onChange = vi.fn()
    const { user } = render(
      <>
        <Field
          id="policy"
          error="Confirm the policy."
          label="Accept policy"
          readOnly
          required
        >
          <Checkbox
            aria-describedby="note"
            defaultChecked
            onChange={onChange}
          />
        </Field>
        <span id="note">Updated today.</span>
      </>,
    )

    const checkbox = screen.getByRole("checkbox", { name: "Accept policy" })
    await user.tab()
    await user.keyboard(" ")
    await user.click(screen.getByText("Accept policy"))

    expect(checkbox).toHaveFocus()
    expect(checkbox).toBeChecked()
    expect(checkbox).toBeRequired()
    expect(checkbox).toHaveAttribute("aria-invalid", "true")
    expect(checkbox).toHaveAttribute("aria-readonly", "true")
    expect(checkbox).toHaveAttribute("id", "policy")
    expect(checkbox).toHaveAccessibleDescription(
      "Confirm the policy. Updated today.",
    )
    expect(onChange).not.toHaveBeenCalled()
  })

  test("has no accessibility violations", async () => {
    await a11y(
      <Field disabled label="Send updates">
        <Checkbox defaultChecked />
      </Field>,
    )
  })
})
