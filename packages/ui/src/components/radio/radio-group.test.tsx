import { a11y, render, screen } from "#test"
import { Field } from "../field/field"
import { Radio } from "./radio"
import { RadioGroup } from "./radio-group"

const options = (
  <>
    <label htmlFor="standard">
      <Radio id="standard" defaultChecked value="standard" /> Standard
    </label>
    <label htmlFor="express">
      <Radio id="express" value="express" /> Express
    </label>
  </>
)

describe("<RadioGroup />", () => {
  test("selects generated items by value and restores the default after a form reset", async () => {
    const onChange = vi.fn()
    const { user } = render(
      <form aria-label="Order">
        <RadioGroup.Root
          name="speed"
          defaultValue="standard"
          items={[
            { label: "Standard", value: "standard" },
            { label: "Express", value: "express" },
          ]}
          legend="Shipping speed"
          onChange={onChange}
        />
        <button type="reset">Reset</button>
      </form>,
    )
    const standard = screen.getByRole("radio", { name: "Standard" })
    const express = screen.getByRole("radio", { name: "Express" })
    expect(standard).toBeChecked()
    await user.tab()
    await user.keyboard("{ArrowRight}")
    expect(express).toBeChecked()
    expect(onChange).toHaveBeenCalledExactlyOnceWith("express")
    await user.click(screen.getByRole("button", { name: "Reset" }))
    expect(standard).toBeChecked()
    expect(express).not.toBeChecked()
  })

  test("lets the caller control selection and applies item slot props", async () => {
    const onChange = vi.fn()
    const group = (value: string | undefined) => (
      <RadioGroup.Root
        legend="Shipping speed"
        value={value}
        onChange={onChange}
      >
        <RadioGroup.Item value="standard">Standard</RadioGroup.Item>
        <RadioGroup.Item
          value="express"
          indicatorProps={{ id: "express-indicator" }}
          inputProps={{ id: "express-input" }}
          labelProps={{ id: "express-label" }}
        >
          Express
        </RadioGroup.Item>
      </RadioGroup.Root>
    )
    const { rerender, user } = render(group(undefined))
    const standard = screen.getByRole("radio", { name: "Standard" })
    const express = screen.getByRole("radio", { name: "Express" })

    expect(standard).not.toBeChecked()
    expect(express).not.toBeChecked()
    expect(express).toHaveAttribute("id", "express-input")
    expect(express.nextElementSibling).toHaveAttribute(
      "id",
      "express-indicator",
    )
    expect(screen.getByText("Express")).toHaveAttribute("id", "express-label")
    await user.click(express)
    expect(onChange).toHaveBeenCalledExactlyOnceWith("express")
    expect(express).not.toBeChecked()
    rerender(group("express"))
    expect(express).toBeChecked()
    rerender(group(undefined))
    expect(express).not.toBeChecked()
    await a11y(group("standard"))
  })

  test("manages compound items when only onChange is supplied", async () => {
    const onChange = vi.fn()
    const { user } = render(
      <RadioGroup.Root legend="Shipping speed" onChange={onChange}>
        <RadioGroup.Item defaultChecked value="standard">
          Standard
        </RadioGroup.Item>
        <RadioGroup.Item value="express">Express</RadioGroup.Item>
      </RadioGroup.Root>,
    )
    const standard = screen.getByRole("radio", { name: "Standard" })
    const express = screen.getByRole("radio", { name: "Express" })
    expect(standard).not.toBeChecked()
    await user.click(express)
    expect(express).toBeChecked()
    expect(onChange).toHaveBeenCalledExactlyOnceWith("express")
  })

  test("shares a form name and supports native keyboard selection", async () => {
    const { user } = render(
      <form aria-label="Order">
        <RadioGroup name="speed" size="lg" legend="Shipping speed" required>
          {options}
        </RadioGroup>
      </form>,
    )

    const group = screen.getByRole("radiogroup", { name: "Shipping speed" })
    const standard = screen.getByRole("radio", { name: "Standard" })
    const express = screen.getByRole("radio", { name: "Express" })

    expect(group.tagName).toBe("FIELDSET")
    expect(group).toHaveAttribute("aria-required", "true")
    expect(group).not.toHaveAttribute("aria-readonly")
    expect(standard).toHaveAttribute("name", "speed")
    expect(express).toHaveAttribute("name", "speed")
    expect(express).toHaveAttribute("data-size", "lg")
    expect(standard).toBeRequired()
    expect(standard).toBeChecked()

    await user.tab()
    await user.keyboard("{ArrowRight}")

    expect(standard).not.toBeChecked()
    expect(express).toBeChecked()
    expect(
      new FormData(
        screen.getByRole<HTMLFormElement>("form", { name: "Order" }),
      ).get("speed"),
    ).toBe("express")
  })

  test("gives separate groups distinct generated names", () => {
    render(
      <>
        <RadioGroup legend="Shipping speed">{options}</RadioGroup>
        <RadioGroup legend="Delivery day">
          <Radio aria-label="Friday" defaultChecked />
        </RadioGroup>
      </>,
    )

    const standard = screen.getByRole("radio", { name: "Standard" })
    const express = screen.getByRole("radio", { name: "Express" })
    const friday = screen.getByRole("radio", { name: "Friday" })
    expect(standard).toHaveAttribute("name", express.getAttribute("name"))
    expect(friday).not.toHaveAttribute("name", express.getAttribute("name"))
    expect(standard).toBeChecked()
    expect(friday).toBeChecked()
  })

  test("applies Field state to the group without replacing the individual radio ids", async () => {
    const { rerender, user } = render(
      <Field id="speed" error="Confirm shipping speed." readOnly required>
        <RadioGroup legend="Shipping speed">{options}</RadioGroup>
      </Field>,
    )

    const group = screen.getByRole("radiogroup", { name: "Shipping speed" })
    const standard = screen.getByRole("radio", { name: "Standard" })
    const express = screen.getByRole("radio", { name: "Express" })
    expect(group).toHaveAttribute("id", "speed")
    expect(group).toHaveAccessibleDescription("Confirm shipping speed.")
    expect(group).toHaveAttribute("aria-invalid", "true")
    expect(group).toHaveAttribute("aria-readonly", "true")
    expect(standard).toHaveAttribute("aria-invalid", "true")
    expect(express).toHaveAttribute("aria-invalid", "true")
    expect(express).toHaveAttribute("id", "express")
    expect(express).toBeRequired()

    await user.tab()
    await user.keyboard("{ArrowRight}")
    expect(standard).toBeChecked()
    expect(express).not.toBeChecked()

    // The test DOM does not restore the previous radio after a canceled click.
    // Check cancellation here and verify selection retention in the browser.
    const onClick = vi.fn((event: React.MouseEvent<HTMLInputElement>) => {
      expect(event.defaultPrevented).toBeTruthy()
    })
    rerender(
      <RadioGroup legend="Shipping speed" readOnly>
        <Radio aria-label="Express" onClick={onClick} />
      </RadioGroup>,
    )
    expect(
      screen.getByRole("radiogroup", { name: "Shipping speed" }),
    ).toHaveAttribute("aria-readonly", "true")
    await user.click(screen.getByRole("radio", { name: "Express" }))
    expect(onClick).toHaveBeenCalledOnce()

    rerender(
      <Field disabled>
        <RadioGroup legend="Shipping speed">{options}</RadioGroup>
      </Field>,
    )
    expect(screen.getByRole("radio", { name: "Express" })).toBeDisabled()
  })

  test("has no accessibility violations", async () => {
    await a11y(
      <>
        <RadioGroup
          aria-describedby="speed-error"
          aria-invalid="true"
          legend="Shipping speed"
          readOnly
          required
        >
          {options}
        </RadioGroup>
        <span id="speed-error">Confirm the shipping speed.</span>
      </>,
    )
  })
})
