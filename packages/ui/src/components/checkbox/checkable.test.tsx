import type { CSSProperties } from "react"
import { a11y, render, screen } from "#test"
import { splitSelector } from "../../core/compile-style"
import { compileComponentStyle } from "../../core/create-css"
import { createTokenVars } from "../../core/tokens"
import { theme } from "../../theme"
import { Fieldset } from "../fieldset/fieldset"
import { Radio } from "../radio/radio"
import { radioStyle } from "../radio/radio.style"
import { Switch } from "../switch/switch"
import { switchStyle } from "../switch/switch.style"
import { checkableStyle } from "./checkable.style"
import { Checkbox } from "./checkbox"
import { checkboxStyle } from "./checkbox.style"

const controls = [
  ["checkbox", Checkbox, checkboxStyle],
  ["radio", Radio, radioStyle],
  ["switch", Switch, switchStyle],
] as const
const context = { theme, vars: createTokenVars(theme) }
const rules = compileComponentStyle("checkable", checkableStyle, context)
const selector = '.ui-checkable[data-size="lg"]'

describe("shared checkable behavior", () => {
  test.each(controls)(
    "applies %s styles to the requested element",
    async (role, Control) => {
      const example = (
        <Control
          style={
            {
              "--check-error": "red",
              marginTop: "1px",
              width: "80px",
            } as CSSProperties
          }
          inputProps={{ style: { marginTop: "3px" } }}
          rootProps={{ style: { marginTop: "2px" } }}
        >
          Example
        </Control>
      )
      render(example)
      const input = screen.getByRole(role, { name: "Example" })
      expect(input).toHaveStyle({ marginTop: "3px" })
      expect(input.style.width).toBe("")
      expect(input.parentElement).toHaveStyle({
        marginTop: "2px",
        width: "80px",
      })
      expect(input.parentElement?.style.getPropertyValue("--check-error")).toBe(
        "red",
      )
      await a11y(example)
    },
  )

  test.each(controls)(
    "inherits %s size and respects an explicit size",
    (role, Control) => {
      render(
        <Fieldset size="lg" legend="Examples">
          <Control>Inherited size</Control>
          <Control size="sm">Explicit size</Control>
        </Fieldset>,
      )
      const inherited = screen.getByRole(role, { name: "Inherited size" })
      const explicit = screen.getByRole(role, { name: "Explicit size" })
      expect(inherited).toHaveAttribute("data-size", "lg")
      expect(inherited.parentElement).toHaveAttribute("data-size", "lg")
      expect(explicit).toHaveAttribute("data-size", "sm")
      expect(explicit.parentElement).toHaveAttribute("data-size", "sm")
    },
  )
})

describe("shared checkable styles", () => {
  test("lets large controls and external labels grow beyond the minimum height", () => {
    const root = rules.find((rule) => rule.selector === selector)
    expect(root?.declarations).toContain("min-height: var(--sizes-11)")
    expect(
      root?.declarations.some((value) => value.startsWith("height:")),
    ).toBeFalsy()
    const labels = rules.find((rule) =>
      splitSelector(rule.selector).includes(`label:has(${selector})`),
    )
    expect(splitSelector(labels?.selector ?? "")).toStrictEqual([
      `label:has(${selector})`,
      `label[for]:has(+ ${selector})`,
      `${selector} + label[for]`,
    ])
    expect(labels?.declarations).toContain("min-height: var(--sizes-11)")
    for (const [name, , style] of controls)
      expect(
        compileComponentStyle(name, style, context).some(({ selector }) =>
          selector.includes("data-size"),
        ),
      ).toBeFalsy()
  })

  test("colors the invalid indicator border and keeps the inset ring on Switch", () => {
    const invalid = " > input[aria-invalid=true] + span"
    const indicator = rules.find(
      (rule) => rule.selector === `.ui-checkable${invalid}`,
    )
    expect(indicator?.declarations).toContain(
      "--check-edge: var(--check-error)",
    )
    expect(indicator?.declarations).toContain(
      "--check-on-edge: var(--check-error)",
    )
    expect(
      indicator?.declarations.some((value) => value.startsWith("box-shadow:")),
    ).toBeFalsy()
    const track = compileComponentStyle("switch", switchStyle, context).find(
      (rule) => rule.selector === `.ui-switch${invalid}`,
    )
    expect(track?.declarations).toContain(
      "box-shadow: inset 0 0 0 1px var(--check-error)",
    )
  })

  test("prevents text selection while using theme colors for the switch thumb", () => {
    expect(
      rules.find((rule) => rule.selector === ".ui-checkable")?.declarations,
    ).toContain("user-select: none")
    const thumb = compileComponentStyle("switch", switchStyle, context).find(
      (rule) => rule.selector === ".ui-switch [data-part=thumb]",
    )
    expect(thumb?.declarations).toContain("background: var(--colors-white)")
    expect(thumb?.declarations).toContain("color: var(--colors-black)")
  })
})
