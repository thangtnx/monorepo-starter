import { mkdir, writeFile } from "node:fs/promises"
import { componentStyles } from "../src/component-styles"
import { createCss } from "../src/core"
import { theme } from "../src/theme"

const output = new URL("../dist/", import.meta.url)

await mkdir(output, { recursive: true })
await writeFile(
  new URL("styles.css", output),
  createCss(theme, componentStyles),
)
