import { inputStyle } from "../components/input/input.style"
import { visuallyHiddenStyle } from "../components/visually-hidden/visually-hidden.style"
import { theme } from "../theme"
import { compileComponentStyle, createCss } from "./create-css"
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
      "@layer reset, tokens, global, components",
      "@layer reset ",
      "@layer tokens ",
      "@layer global ",
      "@layer components ",
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

  test("clips visually hidden content with a modern CSS property", () => {
    expect(
      compileComponentStyle("visually-hidden", visuallyHiddenStyle, context)[0]
        ?.declarations,
    ).toContain("clip-path: inset(50%)")
  })
})
