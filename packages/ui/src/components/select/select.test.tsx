import { createRef } from "react"
import { a11y, render, screen } from "#test"
import { Field } from "../field/field"
import { Select } from "./select"

const options = (
  <>
    <option value="email">Email</option>
    <option value="phone">Phone</option>
    <option value="post">Post</option>
  </>
)

describe("<Select />", () => {
  test("selects and submits an option through native form controls", async () => {
    const { user } = render(
      <form aria-label="Preferences">
        <Select name="contact" size="sm" aria-label="Contact method">
          {options}
        </Select>
      </form>,
    )

    const select = screen.getByRole("combobox", { name: "Contact method" })
    await user.selectOptions(select, "phone")

    expect(select).toHaveValue("phone")
    expect(select).toHaveAttribute("data-size", "sm")
    expect(select).not.toHaveAttribute("size")
    expect(
      new FormData(
        screen.getByRole<HTMLFormElement>("form", { name: "Preferences" }),
      ).get("contact"),
    ).toBe("phone")
  })

  test("uses Field state and preserves a readonly value in submissions", async () => {
    const onChange = vi.fn()
    const { user } = render(
      <form aria-label="Preferences">
        <Field
          id="contact"
          error="Confirm this method."
          label="Contact method"
          readOnly
          required
        >
          <Select
            name="contact"
            aria-describedby="note"
            defaultValue="phone"
            onChange={onChange}
          >
            {options}
          </Select>
        </Field>
        <span id="note">Used for account updates.</span>
      </form>,
    )

    const select = screen.getByRole("combobox", { name: "Contact method" })
    await user.selectOptions(select, "email")

    expect(select).toHaveAttribute("id", "contact")
    expect(select).toHaveAccessibleDescription(
      "Confirm this method. Used for account updates.",
    )
    expect(select).toHaveAttribute("aria-invalid", "true")
    expect(select).toHaveAttribute("aria-readonly", "true")
    expect(select).toBeRequired()
    expect(select).toBeEnabled()
    expect(select).toHaveValue("phone")
    expect(onChange).not.toHaveBeenCalled()
    expect(
      new FormData(
        screen.getByRole<HTMLFormElement>("form", { name: "Preferences" }),
      ).get("contact"),
    ).toBe("phone")
  })

  test("preserves multiple selections and native list box rows in read-only mode", async () => {
    const { user } = render(
      <Select
        aria-label="Contact methods"
        defaultValue={["email", "post"]}
        multiple
        readOnly
        visibleRows={3}
      >
        {options}
      </Select>,
    )

    const select = screen.getByRole("listbox", { name: "Contact methods" })
    await user.deselectOptions(select, "post")
    await user.selectOptions(select, "phone")

    expect(select).toHaveAttribute("size", "3")
    expect(select).toHaveValue(["email", "post"])
  })

  test("blocks selection keys while allowing navigation and modified shortcuts", async () => {
    const { user } = render(
      <>
        <Select aria-label="Contact method" defaultValue="phone" readOnly>
          {options}
        </Select>
        <button type="button">Continue</button>
      </>,
    )
    const select = screen.getByRole("combobox", { name: "Contact method" })
    await user.tab()
    expect(select).toHaveFocus()

    for (const [key, modifiers, canceled] of [
      ["ArrowDown", {}, true],
      ["ArrowDown", { altKey: true }, true],
      ["ArrowUp", { altKey: true }, true],
      ["Tab", {}, false],
      ["Escape", {}, false],
      ["r", { ctrlKey: true }, false],
      ["c", { metaKey: true }, false],
      ["ArrowLeft", { altKey: true }, false],
      ["ArrowDown", { altKey: true, ctrlKey: true }, false],
    ] as const) {
      const event = new KeyboardEvent("keydown", {
        key,
        bubbles: true,
        cancelable: true,
        ...modifiers,
      })
      select.dispatchEvent(event)
      expect(event).toMatchObject({
        key,
        ...modifiers,
        defaultPrevented: canceled,
      })
    }

    expect(select).toHaveValue("phone")
    await user.tab()
    expect(screen.getByRole("button", { name: "Continue" })).toHaveFocus()
  })

  test("preserves the selection established by a native form reset", async () => {
    const preferences = (readOnly: boolean) => (
      <form aria-label="Preferences">
        <Select
          aria-label="Contact method"
          defaultValue="phone"
          readOnly={readOnly}
        >
          {options}
        </Select>
      </form>
    )
    const { rerender, user } = render(preferences(false))
    const form = screen.getByRole<HTMLFormElement>("form", {
      name: "Preferences",
    })
    const select = screen.getByRole("combobox", { name: "Contact method" })

    await user.selectOptions(select, "post")
    rerender(preferences(true))
    expect(select).toHaveValue("post")
    form.reset()
    expect(select).toHaveValue("phone")

    await user.selectOptions(select, "email")
    expect(select).toHaveValue("phone")
  })

  test("keeps the forwarded ref attached through read-only and value updates", async () => {
    const cleanup = vi.fn()
    const ref = vi.fn(() => cleanup)
    const contact = (readOnly: boolean, value: string) => (
      <Select
        ref={ref}
        aria-label="Contact method"
        readOnly={readOnly}
        value={value}
      >
        {options}
      </Select>
    )
    const { rerender, unmount, user } = render(contact(false, "email"))
    const select = screen.getByRole("combobox", { name: "Contact method" })
    rerender(contact(true, "phone"))
    rerender(contact(true, "post"))
    expect(ref).toHaveBeenCalledExactlyOnceWith(select)
    expect(cleanup).not.toHaveBeenCalled()
    await user.selectOptions(select, "email")
    expect(select).toHaveValue("post")

    unmount()
    expect(cleanup).toHaveBeenCalledOnce()
  })

  test("clears the forwarded object ref on unmount", () => {
    const ref = createRef<HTMLSelectElement>()
    const { unmount } = render(
      <Select ref={ref} aria-label="Contact method">
        {options}
      </Select>,
    )

    expect(ref.current).toBe(
      screen.getByRole("combobox", { name: "Contact method" }),
    )
    unmount()
    expect(ref.current).toBeNull()
  })

  test("passes null on unmount to a callback ref without a cleanup", () => {
    const ref = vi.fn()
    const { unmount } = render(
      <Select ref={ref} aria-label="Contact method">
        {options}
      </Select>,
    )

    expect(ref).toHaveBeenCalledExactlyOnceWith(
      screen.getByRole("combobox", { name: "Contact method" }),
    )
    unmount()
    expect(ref).toHaveBeenCalledTimes(2)
    expect(ref).toHaveBeenLastCalledWith(null)
  })

  test("inherits the Field disabled state", () => {
    render(
      <Field disabled label="Contact method">
        <Select>{options}</Select>
      </Field>,
    )
    expect(
      screen.getByRole("combobox", { name: "Contact method" }),
    ).toBeDisabled()
  })

  test("has no accessibility violations", async () => {
    await a11y(
      <Field label="Contact method" readOnly>
        <Select>{options}</Select>
      </Field>,
    )
  })
})
