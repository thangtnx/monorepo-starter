import { a11y, render, screen } from "#test"
import { Field } from "../field/field"
import { Switch } from "./switch"

describe("<Switch />", () => {
  test("uses native checkbox behavior and exposes a switch role", async () => {
    const { user } = render(
      <form aria-label="Preferences">
        <Field label="Notifications">
          <Switch name="notifications" colorScheme="info" size="sm" />
        </Field>
      </form>,
    )

    const toggle = screen.getByRole("switch", { name: "Notifications" })
    expect(toggle).toHaveAttribute("type", "checkbox")
    expect(toggle).toHaveAttribute("data-size", "sm")
    expect(toggle).toHaveAttribute("data-scheme", "info")

    await user.tab()
    await user.keyboard(" ")

    expect(toggle).toBeChecked()
    expect(
      new FormData(
        screen.getByRole<HTMLFormElement>("form", { name: "Preferences" }),
      ).get("notifications"),
    ).toBe("on")
  })

  test("uses Field state and rejects read-only and disabled activation", async () => {
    const onChange = vi.fn()
    const { user } = render(
      <>
        <Field
          id="notifications"
          error="Choose a setting."
          label="Notifications"
          readOnly
          required
        >
          <Switch aria-describedby="note" defaultChecked onChange={onChange} />
        </Field>
        <Field disabled label="Weekly summary">
          <Switch onChange={onChange} />
        </Field>
        <span id="note">You can change this later.</span>
      </>,
    )

    const readonly = screen.getByRole("switch", { name: "Notifications" })
    const disabled = screen.getByRole("switch", { name: "Weekly summary" })
    await user.tab()
    expect(readonly).toHaveFocus()
    await user.keyboard(" ")
    expect(readonly).toBeChecked()

    await user.click(readonly)
    await user.click(disabled)

    expect(readonly).toHaveAttribute("id", "notifications")
    expect(readonly).toHaveAccessibleDescription(
      "Choose a setting. You can change this later.",
    )
    expect(readonly).toHaveAttribute("aria-invalid", "true")
    expect(readonly).toHaveAttribute("aria-readonly", "true")
    expect(readonly).toBeRequired()
    expect(readonly).toBeChecked()
    expect(disabled).toBeDisabled()
    expect(disabled).not.toBeChecked()
    expect(onChange).not.toHaveBeenCalled()
  })

  test("has no accessibility violations", async () => {
    await a11y(
      <Field label="Notifications" readOnly>
        <Switch defaultChecked />
      </Field>,
    )
  })
})
