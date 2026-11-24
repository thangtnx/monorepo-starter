import { componentStyles } from "./component-styles"
import { createCss } from "./core"
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

  test("stays within its size budget", () => {
    expect(Buffer.byteLength(css)).toBeLessThan(64_000)
  })
})
