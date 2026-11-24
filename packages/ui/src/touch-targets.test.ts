import { componentStyles } from "./component-styles"
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
    ["checkbox", "height"],
    ["radio", "height"],
    ["switch", "height"],
  ])("%s is at least 44px high", (name, property) => {
    expectHeight(name, `.ui-${name}[data-size="lg"]`, property)
  })

  describe.each(["checkbox", "radio", "switch"])("%s labels", (name) => {
    const control = `.ui-${name}[data-size="lg"]`
    test.each([
      ["wrapping label", `label:has(${control})`],
      ["preceding label", `label[for]:has(+ ${control})`],
      ["following label", `${control} + label[for]`],
    ])("the %s is at least 44px high", (_, selector) => {
      expectHeight(name, selector, "min-height")
    })
  })
})

function expectHeight(name: string, selector: string, property: string) {
  const rules = compileComponentStyle(name, componentStyles[name]!, context)
  const value = rules
    .find((rule) => splitSelector(rule.selector).includes(selector))
    ?.declarations.find((value) => value.startsWith(`${property}: `))
    ?.slice(property.length + 2)
  const token = value?.match(/^var\((--sizes-[^)]+)\)$/)?.[1]
  const length = String(
    token ? sizes.find(({ name }) => name === token)?.value : value,
  )
  const pixels = Number.parseFloat(length) * (length.endsWith("rem") ? 16 : 1)

  expect(length).toMatch(/^\d+(\.\d+)?(px|rem)$/)
  expect(pixels).toBeGreaterThanOrEqual(44)
}
