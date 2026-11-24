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

  test("stays within its size budget", () => {
    expect(Buffer.byteLength(css)).toBeLessThan(64_000)
  })
})
