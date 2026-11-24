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
