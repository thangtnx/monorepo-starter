import type { ThemeProps } from "./define"
import { inputStyle } from "../components/input/input.style"
import { visuallyHiddenStyle } from "../components/visually-hidden/visually-hidden.style"
import { theme } from "../theme"
import { compileComponentStyle, createCss } from "./create-css"
import { defineComponentSlotStyle, defineComponentStyle } from "./define"
import { createTokenVars } from "./tokens"

const context = { theme, vars: createTokenVars(theme) }

describe("createCss", () => {
  test("places base conditions after variants, sizes and props", () => {
    const rules = compileComponentStyle(
      "control",
      {
        base: {
          opacity: 1,
          _motionReduce: { transitionDuration: "0s" },
          _disabled: { opacity: 0.5 },
        },
        props: { elevated: { true: { opacity: 1 } } },
        sizes: { sm: { opacity: 1 } },
        variants: { solid: { opacity: 1 } },
      },
      context,
    )

    expect(
      rules.map(({ atRules, selector }) => [...atRules, selector]),
    ).toStrictEqual([
      [".ui-control"],
      ['.ui-control[data-variant="solid"]'],
      ['.ui-control[data-size="sm"]'],
      ['.ui-control[data-elevated="true"]'],
      ["@media (prefers-reduced-motion: reduce)", ".ui-control"],
      [
        ".ui-control:disabled, .ui-control[data-disabled], .ui-control[aria-disabled=true]",
      ],
    ])
  })

  test("gives the invalid input border precedence over the hover border", () => {
    const borderRules = compileComponentStyle(
      "input",
      inputStyle,
      context,
    ).filter(({ declarations }) =>
      declarations.some((value) => value.startsWith("border-color:")),
    )

    expect(borderRules.slice(1)).toMatchObject([
      {
        declarations: ["border-color: var(--colors-fg-muted)"],
        selector:
          ".ui-input:hover:where(:not(:disabled, [data-disabled], [aria-disabled=true]))",
      },
      {
        declarations: [
          "border-color: var(--colors-danger-solid)",
          "box-shadow: 0 0 0 1px var(--colors-danger-solid)",
        ],
        selector: ".ui-input[aria-invalid=true], .ui-input[data-invalid]",
      },
    ])
  })

  test("emits ordered layers, mode overrides and color scheme aliases", () => {
    const css = createCss(theme, { input: inputStyle })

    expect(css.match(/@layer [^{;\n]+/g)).toStrictEqual([
      "@layer reset, tokens, global, base, size, variant, props, compounds",
      "@layer reset ",
      "@layer tokens ",
      "@layer global ",
      "@layer base ",
      "@layer size ",
      "@layer variant ",
      "@layer props ",
      "@layer compounds ",
    ])
    expect(css).toMatch(/:root \{[^}]*color-scheme: light;/)
    expect(css).toMatch(/\[data-mode="light"\] \{[^}]*color-scheme: light;/)
    expect(css).toMatch(/\[data-mode="dark"\] \{[^}]*color-scheme: dark;/)
    expect(css).toMatch(
      /@media \(prefers-color-scheme: dark\) \{\s*:root:not\(\[data-mode="light"\]\) \{[^}]*color-scheme: dark;/,
    )
    expect(css).toMatch(
      /\[data-scheme="primary"\] \{[^}]*--color-scheme-solid: var\(--colors-primary-solid\);/,
    )
    expect(css).toContain("--colors-focus-ring:")
    expect(css).toContain("--easings-in-out:")
  })

  test("places flat modifiers and compounds in their cascade layers", () => {
    const css = createCss(theme, {
      card: defineComponentStyle({
        base: { opacity: 0.5 },
        compounds: [
          {
            css: { opacity: 1 },
            colorScheme: "primary",
            size: "sm",
            variant: ["solid", "outline"],
            fullWidth: false,
          },
          { css: { opacity: 0 }, size: [] },
        ],
        props: { fullWidth: { true: { opacity: 0.8 } } },
        sizes: { sm: { opacity: 0.6 } },
        variants: { solid: { opacity: 0.7 } },
      }),
    })

    expect(css).toMatch(/@layer base \{\s*\.ui-card \{\s*opacity: 0.5;/)
    expect(css).toMatch(/@layer size \{\s*\.ui-card\[data-size="sm"\] \{/)
    expect(css).toMatch(
      /@layer variant \{\s*\.ui-card\[data-variant="solid"\] \{/,
    )
    expect(css).toMatch(
      /@layer props \{\s*\.ui-card\[data-full-width="true"\] \{/,
    )
    expect(css).toContain(
      '.ui-card[data-scheme="primary"][data-size="sm"]:is([data-variant="solid"], [data-variant="outline"])[data-full-width="false"]',
    )
    expect(css.split("@layer compounds {")[1]).not.toContain("opacity: 0;")
  })

  test("compiles each slot on its own class and data attributes", () => {
    const style = defineComponentSlotStyle({
      base: { label: { opacity: 0.5 }, root: { display: "grid" } },
      compounds: [
        {
          css: { icon: { opacity: 1 }, label: { _hover: { opacity: 1 } } },
          size: "sm",
          variant: "solid",
        },
      ],
      props: { emphasized: { true: { label: { fontWeight: "bold" } } } },
      sizes: { sm: { label: { fontSize: "sm" } } },
      variants: { solid: { label: { opacity: 0.7 }, root: { opacity: 1 } } },
      defaultProps: { root: { variant: "solid" } },
    })
    const rules = compileComponentStyle("badge", style, context)

    expect(rules.map(({ layer, selector }) => [layer, selector])).toStrictEqual(
      [
        ["base", ".ui-badge__label"],
        ["base", ".ui-badge"],
        ["size", '.ui-badge__label[data-size="sm"]'],
        ["variant", '.ui-badge__label[data-variant="solid"]'],
        ["variant", '.ui-badge[data-variant="solid"]'],
        ["props", '.ui-badge__label[data-emphasized="true"]'],
        ["compounds", '.ui-badge__icon[data-size="sm"][data-variant="solid"]'],
        [
          "compounds",
          '.ui-badge__label[data-size="sm"][data-variant="solid"]:hover:where(:not(:disabled, [data-disabled], [aria-disabled=true]))',
        ],
      ],
    )
    expect(createCss(theme, { badge: style })).toContain("@layer compounds {")
  })

  test("rejects invalid scalar and array compound conditions", () => {
    for (const size of [null, ["sm", null]])
      expect(() =>
        compileComponentStyle(
          "badge",
          { compounds: [{ css: { opacity: 1 }, size: size as never }] },
          context,
        ),
      ).toThrow('Invalid compound condition "size"')
  })

  test("infers no values from an empty recipe prop map", () => {
    const style = defineComponentStyle({ props: { empty: {} } })

    expectTypeOf<ThemeProps<typeof style>["empty"]>().toEqualTypeOf<undefined>()
  })

  test("escapes modifier values in CSS strings", () => {
    const [rule] = compileComponentStyle(
      "badge",
      {
        variants: { 'a"b\\c\nd': { display: "block" } },
      },
      context,
    )

    expect(rule?.selector).toBe('.ui-badge[data-variant="a\\22 b\\5c c\\a d"]')
  })

  test("clips visually hidden content with a modern CSS property", () => {
    expect(
      compileComponentStyle("visually-hidden", visuallyHiddenStyle, context)[0]
        ?.declarations,
    ).toContain("clip-path: inset(50%)")
  })
})
