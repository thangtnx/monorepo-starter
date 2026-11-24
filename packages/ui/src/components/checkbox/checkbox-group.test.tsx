import { a11y, render, screen } from "#test"
import { Field } from "../field/field"
import { CheckboxGroup } from "./index"

const items = [
  { label: "Email", value: "email" },
  { label: "Text messages", value: "sms" },
  { label: "Phone calls", value: "phone" },
] as const

describe("CheckboxGroup", () => {
  test("shares the checked icon while allowing an item to override it", () => {
    render(
      <CheckboxGroup.Root
        checkedIcon="Group check"
        defaultValue={["email", "sms"]}
        items={[
          { label: "Email", value: "email" },
          { checkedIcon: "Item check", label: "Text messages", value: "sms" },
        ]}
        legend="Contact methods"
      />,
    )
    expect(screen.getByText("Group check").closest("label")).toHaveTextContent(
      "Email",
    )
    expect(screen.getByText("Item check").closest("label")).toHaveTextContent(
      "Text messages",
    )
  })

  test("associates the Field error and caller description with the group", async () => {
    const example = (
      <Field id="contact" error="Choose a contact method.">
        <CheckboxGroup.Root
          aria-describedby="contact-note"
          items={items}
          legend="Contact methods"
        />
        <span id="contact-note">We only use these for order updates.</span>
      </Field>
    )
    render(example)
    const group = screen.getByRole("group", { name: "Contact methods" })
    const email = screen.getByRole("checkbox", { name: "Email" })
    expect(group).toHaveAccessibleDescription(
      "Choose a contact method. We only use these for order updates.",
    )
    expect(group).toHaveAttribute("aria-invalid", "true")
    expect(email).toHaveAttribute("aria-invalid", "true")
    expect(email).not.toHaveAttribute("aria-describedby")
    await a11y(example)
  })

  test("submits repeated values, enforces max, and resets the uncontrolled selection", async () => {
    const onChange = vi.fn()
    const { user } = render(
      <form aria-label="Preferences">
        <CheckboxGroup.Root
          name="contact"
          defaultValue={["email"]}
          items={items}
          legend="Contact methods"
          max={2}
          required
          onChange={onChange}
        />
        <button type="reset">Reset</button>
      </form>,
    )
    const form = screen.getByRole<HTMLFormElement>("form", {
      name: "Preferences",
    })
    const group = screen.getByRole("group", { name: "Contact methods" })
    const email = screen.getByRole("checkbox", { name: "Email" })
    const text = screen.getByRole("checkbox", { name: "Text messages" })
    const phone = screen.getByRole("checkbox", { name: "Phone calls" })

    expect(group).toHaveTextContent("Contact methods *")
    expect(email).toBeChecked()
    expect(email).not.toBeRequired()
    await user.click(text)
    expect(phone).toBeDisabled()
    expect(new FormData(form).getAll("contact")).toStrictEqual(["email", "sms"])
    expect(onChange).toHaveBeenLastCalledWith(["email", "sms"])

    await user.click(email)
    expect(phone).toBeEnabled()
    await user.click(phone)
    await user.click(screen.getByRole("button", { name: "Reset" }))
    expect(new FormData(form).getAll("contact")).toStrictEqual(["email"])
    expect(onChange).toHaveBeenCalledTimes(3)
  })

  test("reports changes and leaves the selected values under caller control", async () => {
    const onChange = vi.fn()
    const group = (value: string[]) => (
      <CheckboxGroup.Root
        legend="Contact methods"
        value={value}
        onChange={onChange}
      >
        <CheckboxGroup.Item value="email">Email</CheckboxGroup.Item>
        <CheckboxGroup.Item value="sms">Text messages</CheckboxGroup.Item>
      </CheckboxGroup.Root>
    )
    const { rerender, user } = render(group(["email"]))
    const text = screen.getByRole("checkbox", { name: "Text messages" })

    await user.click(text)
    expect(onChange).toHaveBeenCalledWith(["email", "sms"])
    expect(text).not.toBeChecked()
    rerender(group(["sms"]))
    expect(text).toBeChecked()
    await a11y(group(["email"]))
  })
})
