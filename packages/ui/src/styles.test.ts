import { readdirSync } from "node:fs"
import { join } from "node:path"
import { componentStyles } from "./component-styles"
import { createCss } from "./core"
import { theme } from "./theme"

const css = createCss(theme, componentStyles)

describe("compiled stylesheet", () => {
  test("registers every component style under its folder name", async () => {
    const folders = readdirSync(join(import.meta.dirname, "components"), {
      withFileTypes: true,
    }).filter((entry) => entry.isDirectory())
    const found = await Promise.all(
      folders.map(async ({ name }) => {
        const exports = (await import(
          `./components/${name}/${name}.style.ts`
        )) as { [key: string]: unknown }

        return Object.values(exports).map((style) => [name, style] as const)
      }),
    )

    expect(Object.fromEntries(found.flat())).toStrictEqual(componentStyles)
  })

  test("defines every variable it uses", () => {
    const defined = new Set(
      [...css.matchAll(/(--[\w-]+):/g)].map((match) => match[1]),
    )
    const used = new Set(
      [...css.matchAll(/var\((--[\w-]+)\)/g)].map((match) => match[1]),
    )

    expect([...used].filter((name) => !defined.has(name))).toStrictEqual([])
  })

  test("stays within its size budget", () => {
    expect(Buffer.byteLength(css)).toBeLessThan(64_000)
  })
})
