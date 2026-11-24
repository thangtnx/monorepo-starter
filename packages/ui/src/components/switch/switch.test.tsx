import { a11y, render, screen } from "#test"
import { Field } from "../field/field"
import { Switch } from "./switch"

describe("<Switch />", () => {
  test("toggles with Enter and Space and supports props for its parts", async () => {
    const toggle = (
      <Switch
        icon={{ off: "Off icon", on: "On icon" }}
        inputProps={{ id: "notifications-input" }}
        labelProps={{ id: "notifications-label" }}
        thumbProps={{ id: "notifications-thumb" }}
        trackProps={{ id: "notifications-track" }}
      >
        Notifications
      </Switch>
    )
    const { user } = render(toggle)
    const input = screen.getByRole("switch", { name: "Notifications" })
    expect(input).toHaveAttribute("id", "notifications-input")
    expect(input.nextElementSibling).toHaveAttribute(
      "id",
      "notifications-track",
    )
    expect(input.nextElementSibling?.firstElementChild).toHaveAttribute(
      "id",
      "notifications-thumb",
    )
    expect(screen.getByText("Notifications")).toHaveAttribute(
      "id",
      "notifications-label",
    )
    await user.tab()
    await user.keyboard("{Enter}")
    expect(input).toBeChecked()
    await user.keyboard(" ")
    expect(input).not.toBeChecked()
    await a11y(toggle)
  })

  test("allows Enter toggling to be disabled without affecting Space", async () => {
    const { user } = render(<Switch checkOnEnter={false}>Notifications</Switch>)
    const input = screen.getByRole("switch", { name: "Notifications" })
    await user.tab()
    await user.keyboard("{Enter}")
    expect(input).not.toBeChecked()
    await user.keyboard(" ")
    expect(input).toBeChecked()
  })

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
    const onClick = vi.fn()
    const { user } = render(
      <>
        <Field
          id="notifications"
          error="Choose a setting."
          label="Notifications"
          readOnly
          required
        >
          <Switch
            aria-describedby="note"
            defaultChecked
            onChange={onChange}
            onClick={onClick}
          />
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
    await user.keyboard("{Enter}")
    expect(readonly).toBeChecked()
    expect(onClick).not.toHaveBeenCalled()

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
