import { componentStyles } from "./component-styles"
import { createCss } from "./core"
import { createTokenVars } from "./core/tokens"
import { theme } from "./theme"

const css = createCss(theme, componentStyles)

describe("compiled stylesheet", () => {
  test("registers every component style under its file name", () => {
    const files = import.meta.glob<{ [key: string]: unknown }>(
      "./components/**/*.style.ts",
      { eager: true },
    )
    const entries = Object.entries(files).map(
      ([path, exports]) =>
        [
          path.slice(path.lastIndexOf("/") + 1, -".style.ts".length),
          Object.values(exports),
        ] as const,
    )

    expect(entries.map(([name]) => name).toSorted()).toStrictEqual(
      Object.keys(componentStyles).toSorted(),
    )
    for (const [name, styles] of entries)
      expect(styles).toStrictEqual([componentStyles[name]])
  })

  test("defines every variable it uses", () => {
    const defined = new Set(
      [...css.matchAll(/(--[\w-]+):/g)].map((match) => match[1]),
    )
    const used = new Set(
      [...css.matchAll(/var\(\s*(--[\w-]+)/g)].map((match) => match[1]),
    )

    expect([...used].filter((name) => !defined.has(name))).toStrictEqual([])
  })

  test("uses units for non-zero lengths in compiled declarations", () => {
    const lengthDeclaration =
      /(?:^|(?<=[{;]))\s*(?:(?:padding|margin|inset)(?:-[\w-]+)?|(?:row-|column-)?gap|(?:min-|max-)?(?:width|height|inline-size|block-size)|top|right|bottom|left|border(?:-[\w-]+)?-width|font-size):\s*([^;{}]+);/g
    const bareNumber = /^[+-]?(?:\d*\.\d+|\d+)(?:e[+-]?\d+)?$/i
    const declarations = [...css.matchAll(lengthDeclaration)]
    const invalid: string[] = []

    for (const [declaration, value = ""] of declarations) {
      let depth = 0
      const tokens = value
        .replace(/\s*!\s*important$/i, "")
        .match(/[()]|[^\s()]+/g)

      for (const token of tokens ?? [])
        if (token === "(") depth++
        else if (token === ")") depth--
        else if (depth === 0 && bareNumber.test(token) && Number(token) !== 0)
          invalid.push(declaration.trim())
    }

    expect(declarations.length).toBeGreaterThan(50)
    expect(invalid).toStrictEqual([])
  })

  test("resolves bare color tokens, including logical border sides", () => {
    const logicalBorders = createCss(theme, {
      "logical-borders": {
        base: {
          borderBlockEndColor: "border",
          borderBlockStartColor: "border",
          borderInlineEndColor: "border",
          borderInlineStartColor: "border",
        },
      },
    })
    const vars = createTokenVars(theme)
    const colorDeclaration =
      /^\s*(?:[\w-]+-color|color|background|fill|stroke):\s*([^;]+);/gm
    const unresolved = [...css.matchAll(colorDeclaration)].filter(
      ([, value = ""]) =>
        value.split(/[\s,]+/).some((part) => vars.has(`colors.${part}`)),
    )

    expect(unresolved.map(([rule]) => rule.trim())).toStrictEqual([])
    for (const side of [
      "block-start",
      "block-end",
      "inline-start",
      "inline-end",
    ])
      expect(logicalBorders).toContain(
        `border-${side}-color: var(--colors-border);`,
      )
  })

  test("compiles the external link indicator as visible inline content", () => {
    expect(css).toMatch(
      /\.ui-link > \[data-part=external-indicator\] \{\s*display: inline;\s*margin-inline-start: var\(--spaces-1\);\s*\}/,
    )
  })

  test("keeps select state overrides after its variant rules in the same layer", () => {
    const variant = css.split("@layer variant {")[1]?.split("@layer props {")[0]

    expect(variant).toMatch(
      /\.ui-select\[data-variant="flushed"\][\s\S]*?\.ui-select\[aria-invalid=true\], \.ui-select\[data-invalid\] \{\s*border-color: var\(--colors-danger-solid\);/,
    )
    expect(variant).toMatch(
      /\.ui-select\[data-variant="flushed"\][\s\S]*?\.ui-select\[readonly\][^{]*\{\s*background: var\(--colors-bg-muted\);/,
    )
  })

  test("stays within its size budget", () => {
    expect(Buffer.byteLength(css)).toBeLessThan(96_000)
  })
})
