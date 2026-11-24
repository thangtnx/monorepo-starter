import { createElement } from "react"
import { a11y, render, screen } from "#test"
import { componentStyles } from "./component-styles"
import { Checkbox } from "./components/checkbox/checkbox"
import { Radio } from "./components/radio/radio"
import { Switch } from "./components/switch/switch"
import { splitSelector } from "./core/compile-style"
import { compileComponentStyle } from "./core/create-css"
import { createTokenVars, flattenTokens } from "./core/tokens"
import { theme } from "./theme"

const vars = createTokenVars(theme)
const context = { theme, vars }
const sizes = flattenTokens("sizes", theme.tokens.sizes)

describe("large touch targets", () => {
  test.each([
    ["button", "height"],
    ["input", "height"],
    ["select", "min-height"],
    ["textarea", "min-height"],
  ])("%s is at least 44px high", (name, property) => {
    expectTouchTarget(getHeight(name, `.ui-${name}[data-size="lg"]`, property))
  })

  describe("shared checkable targets", () => {
    const control = '.ui-checkable[data-size="lg"]'

    test.each([
      ["checkbox", createElement(Checkbox, { size: "lg" }, "Example")],
      ["radio", createElement(Radio, { size: "lg" }, "Example")],
      ["switch", createElement(Switch, { size: "lg" }, "Example")],
    ] as const)("large %s uses the shared selector", async (role, example) => {
      render(example)
      const input = screen.getByRole(role, { name: "Example" })

      expect(input.parentElement?.matches(control)).toBeTruthy()
      await a11y(example)
    })

    test.each([
      ["control", control],
      ["wrapping label", `label:has(${control})`],
      ["preceding label", `label[for]:has(+ ${control})`],
      ["following label", `${control} + label[for]`],
    ])("the %s is at least 44px high", (_, selector) => {
      const height = getHeight("checkable", selector, "min-height")
      expect(height).toBe("var(--sizes-11)")
      expectTouchTarget(height)
    })
  })
})

function getHeight(name: string, selector: string, property: string) {
  const rules = compileComponentStyle(name, componentStyles[name]!, context)
  return rules
    .find((rule) => splitSelector(rule.selector).includes(selector))
    ?.declarations.find((value) => value.startsWith(`${property}: `))
    ?.slice(property.length + 2)
}

function expectTouchTarget(value: string | undefined) {
  const token = value?.match(/^var\((--sizes-[^)]+)\)$/)?.[1]
  const length = String(
    token ? sizes.find(({ name }) => name === token)?.value : value,
  )
  const pixels = Number.parseFloat(length) * (length.endsWith("rem") ? 16 : 1)

  expect(length).toMatch(/^\d+(\.\d+)?(px|rem)$/)
  expect(pixels).toBeGreaterThanOrEqual(44)
}
