import { componentStyles } from "../../component-styles"
import { compileComponentStyle } from "../../core/create-css"
import { createTokenVars } from "../../core/tokens"
import { theme } from "../../theme"

const context = { theme, vars: createTokenVars(theme) }
const rules = (name: string) =>
  compileComponentStyle(name, componentStyles[name]!, context)
const declarations = (name: string, selector: string, atRule?: string) =>
  rules(name)
    .filter(
      (rule) =>
        rule.selector === selector &&
        (atRule ? rule.atRules.includes(atRule) : rule.atRules.length === 0),
    )
    .flatMap((rule) => rule.declarations)
const reducedMotion = "@media (prefers-reduced-motion: reduce)"
const option = ".ui-select-listbox [data-part=option]"

describe("select compiled styles", () => {
  test("a selected option keeps its tint color and weight but sets no background", () => {
    const selected = declarations(
      "select-listbox",
      `${option}[aria-selected=true]`,
    )
    expect(selected).toContain("color: var(--color-scheme-fg)")
    expect(
      selected.some((value) => value.startsWith("font-weight")),
    ).toBeTruthy()
    expect(selected.some((value) => value.startsWith("background"))).toBeFalsy()
  })

  test("the active option owns the background and never sets a color for the text", () => {
    const active = declarations("select-listbox", `${option}[data-active]`)
    expect(active).toContain("background: var(--colors-bg-emphasized)")
    expect(active.some((value) => value.startsWith("color"))).toBeFalsy()
    expect(
      rules("select-listbox").some((rule) => rule.selector.includes(":hover")),
    ).toBeFalsy()
  })

  test("sizes the check icon", () => {
    expect(
      declarations("select-listbox", `${option} [data-part=check]`),
    ).not.toHaveLength(0)
  })

  test.each(["select", "select-listbox", "select-root"])(
    "%s colors come from theme variables that switch with the mode",
    (name) => {
      const colors = rules(name)
        .flatMap((rule) => rule.declarations)
        .filter((value) =>
          /^(background|border-color|color|outline):/.test(value),
        )
      expect(colors.length).toBeGreaterThan(0)
      for (const value of colors)
        expect(value).toMatch(/var\(--|transparent|inherit|none/)
    },
  )

  test.each([
    ["select-listbox", ".ui-select-listbox"],
    ["select", ".ui-select"],
    ["select", ".ui-select [data-part=chevron]"],
  ])("%s stops its transition for reduced motion (%s)", (name, selector) => {
    expect(declarations(name, selector, reducedMotion)).toContain(
      "transition-property: none",
    )
  })
})
