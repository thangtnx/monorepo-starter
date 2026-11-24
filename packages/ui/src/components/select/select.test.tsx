import { act, createEvent, fireEvent, within } from "@testing-library/react"
import { createRef } from "react"
import { a11y, render, screen } from "#test"
import { Field } from "../field"
import { Fieldset } from "../fieldset"
import { Select } from "./index"
import { findSelectMatch } from "./select-typeahead"

const items = [
  { label: "Email", value: "email" },
  { disabled: true, label: "Fax", value: "fax" },
  { label: "Phone", value: "phone" },
  { label: "Post", value: "post" },
  { label: "Text message", value: "sms" },
]

const trigger = (name = "Contact method") =>
  screen.getByRole("combobox", { name })
const option = (name: string) => screen.getByRole("option", { name })

describe("<Select />", () => {
  const popoverMethods = ["showPopover", "hidePopover"] as const
  const popoverDescriptors = popoverMethods.map((method) =>
    Object.getOwnPropertyDescriptor(HTMLElement.prototype, method),
  )

  beforeAll(() => {
    // jsdom applies the popover's hidden style without rendering the top layer.
    Object.defineProperties(HTMLElement.prototype, {
      hidePopover: {
        configurable: true,
        value(this: HTMLElement) {
          this.style.removeProperty("display")
        },
      },
      showPopover: {
        configurable: true,
        value(this: HTMLElement) {
          this.style.display = "block"
        },
      },
    })
  })

  afterAll(() => {
    popoverMethods.forEach((method, index) => {
      const descriptor = popoverDescriptors[index]
      if (descriptor)
        Object.defineProperty(HTMLElement.prototype, method, descriptor)
      else Reflect.deleteProperty(HTMLElement.prototype, method)
    })
  })

  test("moves accessibility focus without selecting and commits with Enter or Space", async () => {
    const onChange = vi.fn()
    const { user } = render(
      <Select.Root
        aria-label="Contact method"
        defaultValue="email"
        items={items}
        onChange={onChange}
      />,
    )
    const control = trigger()
    expect(control).toHaveAttribute("aria-expanded", "false")
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument()

    await user.tab()
    await user.keyboard("{Enter}")
    const listbox = screen.getByRole("listbox", { name: "Contact method" })
    expect(control).toHaveAttribute("aria-controls", listbox.id)
    expect(control).toHaveAttribute("aria-haspopup", "listbox")
    expect(control).toHaveAttribute("aria-activedescendant", option("Email").id)

    await user.keyboard("{ArrowDown}")
    expect(control).toHaveAttribute("aria-activedescendant", option("Phone").id)
    expect(control).toHaveTextContent("Email")
    expect(option("Fax")).toHaveAttribute("aria-disabled", "true")
    expect(onChange).not.toHaveBeenCalled()
    await user.keyboard(" ")
    expect(control).toHaveTextContent("Phone")
    expect(control).toHaveFocus()
    expect(control).not.toHaveAttribute("aria-activedescendant")
    expect(onChange).toHaveBeenCalledExactlyOnceWith("phone")

    await user.keyboard("{ArrowUp}{End}{Enter}")
    expect(control).toHaveTextContent("Text message")
    expect(control).toHaveAttribute("aria-expanded", "false")
  })

  test("supports typeahead and Home, Escape, Tab, and outside dismissal", async () => {
    const { user } = render(
      <>
        <Select.Root
          aria-label="Contact method"
          defaultValue="email"
          items={items}
        />
        <button type="button">Continue</button>
      </>,
    )
    const control = trigger()
    const next = screen.getByRole("button", { name: "Continue" })
    await user.tab()
    await user.keyboard("po")
    expect(control).toHaveAttribute("aria-activedescendant", option("Post").id)
    await user.keyboard("{Home}")
    expect(control).toHaveAttribute("aria-activedescendant", option("Email").id)
    await user.keyboard("pp")
    expect(control).toHaveAttribute("aria-activedescendant", option("Post").id)
    await user.keyboard("{Escape}")
    expect(control).toHaveFocus()
    expect(control).toHaveTextContent("Email")
    expect(control).toHaveAttribute("aria-expanded", "false")

    await user.keyboard("{End}")
    await user.click(next)
    expect(control).toHaveTextContent("Email")
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument()

    await user.tab({ shift: true })
    await user.keyboard("{End}{Tab}")
    expect(control).toHaveTextContent("Text message")
    expect(control).toHaveAttribute("aria-expanded", "false")
    expect(next).toHaveFocus()
  })

  test("renders labeled groups from parts and items and selects by pointer", async () => {
    const { user } = render(
      <>
        <Select.Root aria-label="Contact method">
          <Select.Group>
            <Select.Label>Online</Select.Label>
            <Select.Option value="email">Email</Select.Option>
          </Select.Group>
          <Select.Separator />
          <Select.Group disabled label="Unavailable">
            <Select.Option value="fax">Fax</Select.Option>
          </Select.Group>
        </Select.Root>
        <Select.Root
          aria-label="Support method"
          items={[
            { items: [{ label: "Phone", value: "phone" }], label: "Voice" },
          ]}
        />
      </>,
    )
    await user.click(trigger())
    const online = screen.getByRole("group", { name: "Online" })
    expect(within(online).getByRole("option", { name: "Email" })).toBeVisible()
    expect(screen.getByRole("group", { name: "Unavailable" })).toBeVisible()
    await user.click(option("Fax"))
    expect(option("Fax")).toHaveAttribute("aria-selected", "false")
    await user.click(option("Email"))
    expect(trigger()).toHaveTextContent("Email")
    expect(trigger()).toHaveFocus()
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
    await user.click(trigger("Support method"))
    expect(
      within(screen.getByRole("group", { name: "Voice" })).getByRole("option", {
        name: "Phone",
      }),
    ).toBeVisible()
  })

  test("can include or hide the placeholder option", async () => {
    const props = {
      "aria-label": "Contact method",
      items,
      placeholder: "Choose a method",
    }
    const { rerender, user } = render(
      <Select.Root {...props} defaultValue="email" />,
    )
    await user.click(trigger())
    await user.click(option("Choose a method"))
    expect(trigger()).toHaveTextContent("Choose a method")
    rerender(<Select.Root {...props} includePlaceholder={false} />)
    await user.click(trigger())
    expect(
      screen.queryByRole("option", { name: "Choose a method" }),
    ).not.toBeInTheDocument()
  })

  test("toggles multiple selections, enforces max, and clears back to the trigger", async () => {
    const onChange = vi.fn()
    const { user } = render(
      <Select.Root
        aria-label="Contact method"
        clearable
        defaultValue={["email"]}
        items={items}
        max={2}
        multiple
        placeholder="Choose a method"
        separator=" / "
        onChange={onChange}
      />,
    )
    const control = trigger()
    await user.click(control)
    expect(screen.getByRole("listbox")).toHaveAttribute(
      "aria-multiselectable",
      "true",
    )
    expect(
      screen.queryByRole("option", { name: "Choose a method" }),
    ).not.toBeInTheDocument()
    await user.keyboard("{End}")
    expect(option("Text message")).toHaveAttribute("data-active", "true")
    await user.click(option("Phone"))
    expect(option("Text message")).not.toHaveAttribute("data-active")
    expect(control).toHaveTextContent("Email / Phone")
    expect(option("Phone")).toHaveAttribute("aria-selected", "true")
    expect(option("Post")).toHaveAttribute("aria-disabled", "true")
    await user.click(option("Post"))
    expect(onChange).toHaveBeenCalledExactlyOnceWith(["email", "phone"])
    await user.click(option("Email"))
    expect(option("Post")).not.toHaveAttribute("aria-disabled")
    await user.click(screen.getByRole("button", { name: "Clear selection" }))
    expect(onChange).toHaveBeenLastCalledWith([])
    expect(control).toHaveTextContent("Choose a method")
    expect(control).toHaveFocus()
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
  })

  test("renders controlled labels and keeps a callback ref attached", async () => {
    const clean = vi.fn()
    const ref = vi.fn(() => clean)
    const onChange = vi.fn()
    const example = (value: string) => (
      <Select.Root
        ref={ref}
        aria-label="Contact method"
        items={items}
        render={({ label }) => <strong>{label}</strong>}
        value={value}
        onChange={onChange}
      />
    )
    const { rerender, unmount, user } = render(example("email"))
    const control = trigger()
    await user.click(control)
    await user.click(option("Phone"))
    expect(onChange).toHaveBeenCalledExactlyOnceWith("phone")
    expect(within(control).getByText("Email").tagName).toBe("STRONG")
    rerender(example("phone"))
    expect(control).toHaveTextContent("Phone")
    expect(ref).toHaveBeenCalledExactlyOnceWith(control)
    expect(clean).not.toHaveBeenCalled()
    unmount()
    expect(clean).toHaveBeenCalledOnce()
  })

  test("submits single and repeated values and restores defaults on form reset", async () => {
    const ref = createRef<HTMLFormElement>()
    const { user } = render(
      <>
        <form id="settings" ref={ref} />
        <Select.Root
          form="settings"
          name="contact"
          aria-label="Contact method"
          defaultValue="email"
          items={items}
        />
        <form aria-label="Preferences">
          <Select.Root
            name="backup"
            aria-label="Backup methods"
            defaultValue={["sms"]}
            items={items}
            multiple
          />
          <Select.Root
            name="unused"
            aria-label="Disabled method"
            defaultValue="email"
            disabled
            items={items}
          />
          <button type="reset">Reset</button>
        </form>
      </>,
    )
    const form = screen.getByRole<HTMLFormElement>("form", {
      name: "Preferences",
    })
    await user.click(trigger())
    await user.click(option("Phone"))
    expect(new FormData(ref.current!).get("contact")).toBe("phone")
    await user.click(trigger("Backup methods"))
    await user.click(option("Email"))
    expect(new FormData(form).getAll("backup")).toStrictEqual(["sms", "email"])
    expect(new FormData(form).has("unused")).toBeFalsy()
    await user.click(screen.getByRole("button", { name: "Reset" }))
    await act(async () => {
      ref.current?.reset()
      await Promise.resolve()
    })
    expect(new FormData(ref.current!).get("contact")).toBe("email")
    expect(new FormData(form).getAll("backup")).toStrictEqual(["sms"])
    expect(trigger("Disabled method")).toBeDisabled()
  })

  test("validates required values and forwards Field labels, descriptions and state", async () => {
    const { container, user } = render(
      <form aria-label="Preferences">
        <Field
          id="contact"
          hint="Used for delivery updates."
          label="Contact method"
          required
        >
          <Select.Root name="contact" aria-describedby="note" items={items} />
        </Field>
        <p id="note">Choose one method.</p>
      </form>,
    )
    const form = screen.getByRole<HTMLFormElement>("form", {
      name: "Preferences",
    })
    const control = trigger()
    expect(control).toHaveAttribute("id", "contact")
    expect(control).toHaveAccessibleDescription(
      "Used for delivery updates. Choose one method.",
    )
    expect(control).toBeRequired()
    act(() => expect(form.checkValidity()).toBeFalsy())
    expect(control).toHaveFocus()
    expect(control).toHaveAttribute("aria-invalid", "true")
    expect(control).toHaveAccessibleDescription(
      "Used for delivery updates. Choose one method. Select an option.",
    )
    expect(container.querySelectorAll("[id=contact-message]")).toHaveLength(1)
    await a11y(container)
    await user.click(control)
    await user.click(option("Email"))
    expect(form.checkValidity()).toBeTruthy()
    expect(control).not.toHaveAttribute("aria-invalid")
  })

  test("inherits Field and Fieldset states and submits read-only selections", async () => {
    const { user } = render(
      <form aria-label="Preferences">
        <Field
          error="Confirm this method."
          label="Contact method"
          readOnly
          required
        >
          <Select.Root
            name="contact"
            clearable
            defaultValue="phone"
            items={items}
          />
        </Field>
        <Fieldset size="lg" disabled legend="Backup">
          <Select.Root
            name="backup"
            aria-label="Backup method"
            defaultValue="email"
            items={items}
          />
        </Fieldset>
      </form>,
    )
    const control = trigger()
    await user.tab()
    await user.keyboard("{ArrowDown}{Enter}p")
    expect(control).toHaveAccessibleDescription("Confirm this method.")
    expect(control).toHaveAttribute("aria-invalid", "true")
    expect(control).toHaveAttribute("aria-readonly", "true")
    expect(control).toHaveAttribute("aria-expanded", "false")
    expect(control).toHaveFocus()
    const backup = trigger("Backup method")
    expect(backup).toBeDisabled()
    expect(backup).toHaveAttribute("data-size", "lg")
    const form = screen.getByRole<HTMLFormElement>("form", {
      name: "Preferences",
    })
    expect([...new FormData(form)]).toStrictEqual([["contact", "phone"]])
  })

  test("has no accessibility violations with the grouped listbox open", async () => {
    const { container, user } = render(
      <Field label="Contact method" required>
        <Select.Root clearable defaultValue="email">
          <Select.Group label="Online">
            <Select.Option value="email">Email</Select.Option>
          </Select.Group>
          <Select.Separator />
          <Select.Group label="Offline">
            <Select.Option value="phone">Phone</Select.Option>
          </Select.Group>
        </Select.Root>
      </Field>,
    )
    await user.click(trigger())
    expect(
      screen.getByRole("listbox", { name: "Contact method" }),
    ).toBeVisible()
    await a11y(container)
  })

  describe("opening and keyboard", () => {
    test("opens from closed with Space, ArrowDown, ArrowUp, and Alt+Arrow", async () => {
      const { user } = render(
        <Select.Root
          aria-label="Contact method"
          defaultValue="post"
          items={items}
        />,
      )
      const control = trigger()
      await user.tab()
      await user.keyboard(" ")
      expect(control).toHaveAttribute("aria-expanded", "true")
      expect(control).toHaveAttribute(
        "aria-activedescendant",
        option("Post").id,
      )
      await user.keyboard("{Escape}")

      await user.keyboard("{ArrowUp}")
      expect(control).toHaveAttribute(
        "aria-activedescendant",
        option("Email").id,
      )
      await user.keyboard("{Escape}{ArrowDown}")
      expect(control).toHaveAttribute(
        "aria-activedescendant",
        option("Post").id,
      )
      await user.keyboard("{Escape}{Alt>}{ArrowDown}{/Alt}")
      expect(control).toHaveAttribute("aria-expanded", "true")
      await user.keyboard("{ArrowUp}{Alt>}{ArrowUp}{/Alt}")
      expect(control).toHaveAttribute("aria-expanded", "false")
      expect(control).toHaveTextContent("Phone")
    })

    test("clamps arrow movement at both ends and skips disabled options", async () => {
      const { user } = render(
        <Select.Root aria-label="Contact method" items={items} />,
      )
      const control = trigger()
      await user.tab()
      await user.keyboard("{ArrowDown}{ArrowUp}{ArrowUp}")
      expect(control).toHaveAttribute(
        "aria-activedescendant",
        option("Email").id,
      )
      await user.keyboard("{ArrowDown}")
      expect(control).toHaveAttribute(
        "aria-activedescendant",
        option("Phone").id,
      )
      await user.keyboard("{End}{ArrowDown}{ArrowDown}")
      expect(control).toHaveAttribute(
        "aria-activedescendant",
        option("Text message").id,
      )
    })

    test("opens on a typed letter and Space extends a search in progress", async () => {
      const { user } = render(
        <Select.Root
          aria-label="Region"
          items={[
            { label: "New Jersey", value: "nj" },
            { label: "New York", value: "ny" },
            { label: "Texas", value: "tx" },
          ]}
        />,
      )
      const control = trigger("Region")
      await user.tab()
      await user.keyboard("t")
      expect(control).toHaveAttribute("aria-expanded", "true")
      expect(control).toHaveAttribute(
        "aria-activedescendant",
        option("Texas").id,
      )
      await user.keyboard("{Escape}")
      await user.keyboard("new y")
      expect(control).toHaveAttribute("aria-expanded", "true")
      expect(control).toHaveAttribute(
        "aria-activedescendant",
        option("New York").id,
      )
    })

    test("restarts the typeahead search after the timeout", () => {
      const options = [
        { searchText: "post", value: "post" },
        { searchText: "phone", value: "phone" },
      ]
      const first = findSelectMatch(options, undefined, "p", 0, undefined)
      const joined = findSelectMatch(options, "post", "h", 100, first.search)
      expect(joined.search.text).toBe("ph")
      expect(joined.match?.value).toBe("phone")
      const expired = findSelectMatch(options, "post", "h", 5000, first.search)
      expect(expired.search.text).toBe("h")
      expect(expired.match).toBeUndefined()
    })

    test("does not commit multiple selection on Tab", async () => {
      const onChange = vi.fn()
      const { user } = render(
        <>
          <Select.Root
            aria-label="Contact method"
            items={items}
            multiple
            onChange={onChange}
          />
          <button type="button">Continue</button>
        </>,
      )
      await user.tab()
      await user.keyboard("{ArrowDown}{Tab}")
      expect(trigger()).toHaveAttribute("aria-expanded", "false")
      expect(onChange).not.toHaveBeenCalled()
    })

    test("toggles with Enter and Space in multiple mode and keeps the list open", async () => {
      const onChange = vi.fn()
      const { user } = render(
        <Select.Root
          aria-label="Contact method"
          items={items}
          multiple
          placeholder="Choose"
          onChange={onChange}
        />,
      )
      const control = trigger()
      await user.tab()
      await user.keyboard("{Enter}{Enter}")
      await user.keyboard("{ArrowDown} ")
      expect(control).toHaveAttribute("aria-expanded", "true")
      expect(onChange).toHaveBeenLastCalledWith(["email", "phone"])
      expect(control).toHaveTextContent("Email, Phone")
      await user.keyboard("{ArrowUp} ")
      expect(onChange).toHaveBeenLastCalledWith(["phone"])
    })

    test("does not toggle a second time when Space is released", async () => {
      const { user } = render(
        <Select.Root aria-label="Contact method" items={items} />,
      )
      const control = trigger()
      await user.tab()
      await user.keyboard(" ")
      expect(control).toHaveAttribute("aria-expanded", "true")

      const release = createEvent.keyUp(control, { key: " " })
      fireEvent(control, release)
      expect(release.defaultPrevented).toBeTruthy()
      expect(control).toHaveAttribute("aria-expanded", "true")
    })
  })

  describe("pointer", () => {
    test("closes on a trigger click when the browser blurs the pressed button first", async () => {
      const { user } = render(
        <Select.Root aria-label="Contact method" items={items} />,
      )
      const control = trigger()
      await user.click(control)
      expect(control).toHaveAttribute("aria-expanded", "true")

      // WebKit order: pointerdown, mousedown, blur, pointerup, mouseup, click.
      fireEvent.pointerDown(control, { button: 0 })
      fireEvent.mouseDown(control)
      act(() => control.blur())
      expect(control).toHaveAttribute("aria-expanded", "true")
      fireEvent.pointerUp(control)
      fireEvent.mouseUp(control)
      fireEvent.click(control)
      expect(control).toHaveAttribute("aria-expanded", "false")
      expect(control).toHaveFocus()
    })

    test("closes when a trigger press is released elsewhere after the blur", async () => {
      const { user } = render(
        <Select.Root aria-label="Contact method" items={items} />,
      )
      const control = trigger()
      await user.click(control)
      fireEvent.pointerDown(control, { button: 0 })
      act(() => control.blur())
      fireEvent.pointerUp(document.body)
      expect(control).toHaveAttribute("aria-expanded", "false")
    })

    test("keeps the list open when pressing a group label, separator, or the panel", async () => {
      const { user } = render(
        <Select.Root aria-label="Contact method">
          <Select.Group label="Online">
            <Select.Option value="email">Email</Select.Option>
          </Select.Group>
          <Select.Separator />
          <Select.Option value="phone">Phone</Select.Option>
        </Select.Root>,
      )
      const control = trigger()
      await user.click(control)
      await user.click(screen.getByText("Online"))
      await user.click(screen.getByRole("listbox"))
      expect(control).toHaveAttribute("aria-expanded", "true")
      expect(control).toHaveFocus()
    })

    test("moves the active option with the pointer and selects it with Enter", async () => {
      const onChange = vi.fn()
      const { user } = render(
        <Select.Root
          aria-label="Contact method"
          defaultValue="email"
          items={items}
          onChange={onChange}
        />,
      )
      const control = trigger()
      await user.click(control)
      await user.hover(option("Post"))
      expect(option("Post")).toHaveAttribute("data-active", "true")
      expect(option("Email")).not.toHaveAttribute("data-active")
      expect(control).toHaveAttribute(
        "aria-activedescendant",
        option("Post").id,
      )
      await user.hover(option("Fax"))
      expect(option("Post")).toHaveAttribute("data-active", "true")
      await user.keyboard("{Enter}")
      expect(onChange).toHaveBeenCalledExactlyOnceWith("post")
    })

    test("only focuses the trigger when its Field label is clicked", async () => {
      const { user } = render(
        <Field id="contact" label="Contact method">
          <Select.Root items={items} />
        </Field>,
      )
      const control = trigger()
      await user.click(screen.getByText("Contact method"))
      expect(control).toHaveFocus()
      expect(control).toHaveAttribute("aria-expanded", "false")
      await user.click(control)
      expect(control).toHaveAttribute("aria-expanded", "true")
      await user.click(screen.getByText("Contact method"))
      expect(control).toHaveAttribute("aria-expanded", "false")
    })

    test("blocks the pointer when disabled or read-only", async () => {
      const { user } = render(
        <>
          <Select.Root
            aria-label="Disabled method"
            clearable
            defaultValue="email"
            disabled
            items={items}
          />
          <Select.Root
            aria-label="Read-only method"
            clearable
            defaultValue="email"
            items={items}
            readOnly
          />
        </>,
      )
      await user.click(trigger("Disabled method"))
      await user.click(trigger("Read-only method"))
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
      expect(
        screen.queryByRole("button", { name: "Clear selection" }),
      ).not.toBeInTheDocument()
      expect(trigger("Read-only method")).toHaveTextContent("Email")
    })
  })

  describe("content", () => {
    test("renders a label outside a group and the empty state", async () => {
      const { user } = render(
        <>
          <Select.Root aria-label="Contact method">
            <Select.Label>Pick one</Select.Label>
            <Select.Option value="email">Email</Select.Option>
          </Select.Root>
          <Select.Root aria-label="Empty method" />
        </>,
      )
      await user.click(trigger())
      expect(screen.getByText("Pick one")).toBeVisible()
      await user.click(trigger("Empty method"))
      expect(
        screen.getByRole("option", { name: "No options" }),
      ).toHaveAttribute("aria-disabled", "true")
    })

    test("draws the check and clear icons as hidden SVG", async () => {
      const { user } = render(
        <Select.Root
          aria-label="Contact method"
          clearable
          defaultValue="email"
          items={items}
        />,
      )
      await user.click(trigger())
      expect(option("Email").querySelector("svg")).toHaveAttribute(
        "aria-hidden",
        "true",
      )
      const clear = screen.getByRole("button", { name: "Clear selection" })
      expect(clear.querySelector("svg")).toHaveAttribute("aria-hidden", "true")
      expect(document.body).not.toHaveTextContent(/[✓×]/)
    })

    test("warns in development about duplicate values and wrapped options", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
      const Wrapped = () => (
        <Select.Option value="wrapped-x">Wrapped</Select.Option>
      )
      render(
        <Select.Root aria-label="Contact method">
          <Select.Option value="dup-x">One</Select.Option>
          <Select.Option value="dup-x">Two</Select.Option>
          <Wrapped />
        </Select.Root>,
      )
      const messages = warn.mock.calls.map(([message]) => String(message))
      warn.mockRestore()
      expect(messages).toContainEqual(expect.stringContaining('"dup-x"'))
      expect(messages).toContainEqual(
        expect.stringContaining("children must be Select.Option"),
      )
    })
  })

  describe("state and form", () => {
    test("renders controlled multiple values and render arguments", async () => {
      const onChange = vi.fn()
      const example = (value: string[]) => (
        <Select.Root
          aria-label="Contact method"
          items={items}
          multiple
          render={({ count, index, label }) => (
            <span>
              {index + 1}/{count} {label}
            </span>
          )}
          separator=" | "
          value={value}
          onChange={onChange}
        />
      )
      const { rerender, user } = render(example(["email"]))
      await user.click(trigger())
      await user.click(option("Phone"))
      expect(onChange).toHaveBeenCalledExactlyOnceWith(["email", "phone"])
      expect(trigger()).toHaveTextContent("1/1 Email")
      rerender(example(["email", "phone"]))
      expect(trigger()).toHaveTextContent("1/2 Email | 2/2 Phone")
    })

    test("applies the invalid prop, sizes, and variants", () => {
      render(
        <>
          {(["sm", "md", "lg"] as const).map((size) => (
            <Select.Root
              key={size}
              size={size}
              aria-label={`Size ${size}`}
              items={items}
            />
          ))}
          {(["outline", "filled", "flushed"] as const).map((variant) => (
            <Select.Root
              key={variant}
              variant={variant}
              aria-label={`Variant ${variant}`}
              items={items}
            />
          ))}
          <Select.Root aria-label="Invalid method" invalid items={items} />
        </>,
      )
      for (const size of ["sm", "md", "lg"])
        expect(trigger(`Size ${size}`)).toHaveAttribute("data-size", size)
      for (const variant of ["outline", "filled", "flushed"])
        expect(trigger(`Variant ${variant}`)).toHaveAttribute(
          "data-variant",
          variant,
        )
      expect(trigger("Invalid method")).toHaveAttribute("aria-invalid", "true")
    })

    test("submits an empty single value and leaves a controlled value on reset", async () => {
      const onChange = vi.fn()
      const { user } = render(
        <form aria-label="Preferences">
          <Select.Root name="empty" aria-label="Empty method" items={items} />
          <Select.Root
            name="controlled"
            aria-label="Controlled method"
            defaultValue="email"
            items={items}
            value="phone"
            onChange={onChange}
          />
          <button type="reset">Reset</button>
        </form>,
      )
      const form = screen.getByRole<HTMLFormElement>("form", {
        name: "Preferences",
      })
      expect(new FormData(form).get("empty")).toBe("")
      await user.click(screen.getByRole("button", { name: "Reset" }))
      await act(async () => {
        await Promise.resolve()
      })
      expect(trigger("Controlled method")).toHaveTextContent("Phone")
      expect(new FormData(form).get("controlled")).toBe("phone")
      expect(onChange).not.toHaveBeenCalled()
    })

    test("shows a validation message for an empty required Select", async () => {
      const { user } = render(
        <form aria-label="Preferences">
          <Select.Root
            name="contact"
            aria-label="Contact method"
            items={items}
            required
          />
        </form>,
      )
      const form = screen.getByRole<HTMLFormElement>("form", {
        name: "Preferences",
      })
      expect(screen.queryByText("Select an option.")).not.toBeInTheDocument()
      act(() => expect(form.checkValidity()).toBeFalsy())
      expect(screen.getByText("Select an option.")).toBeVisible()
      expect(trigger()).toHaveAccessibleDescription("Select an option.")
      expect(trigger()).toHaveFocus()
      await user.click(trigger())
      await user.click(option("Email"))
      expect(screen.queryByText("Select an option.")).not.toBeInTheDocument()
    })
  })

  test("focuses only the first invalid Select and describes it by the message", () => {
    render(
      <form aria-label="Preferences">
        <Select.Root
          name="a"
          aria-label="First method"
          items={items}
          required
        />
        <Select.Root
          name="b"
          aria-label="Second method"
          items={items}
          required
        />
      </form>,
    )
    const form = screen.getByRole<HTMLFormElement>("form", {
      name: "Preferences",
    })
    act(() => expect(form.checkValidity()).toBeFalsy())
    expect(trigger("First method")).toHaveFocus()
    expect(trigger("First method")).toHaveAccessibleDescription(
      "Select an option.",
    )
    expect(trigger("Second method")).toHaveAttribute("aria-invalid", "true")
    expect(screen.getAllByText("Select an option.")).toHaveLength(2)
  })

  describe("accessibility", () => {
    test("has no violations when closed or when multiple is open", async () => {
      const { container, user } = render(
        <Field label="Contact method">
          <Select.Root items={items} multiple />
        </Field>,
      )
      await a11y(container)
      await user.click(trigger())
      expect(screen.getByRole("listbox")).toBeVisible()
      await a11y(container)
    })
  })
})
