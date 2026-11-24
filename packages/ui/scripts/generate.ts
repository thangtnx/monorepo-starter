import { writeFile } from "node:fs/promises"
import { componentStyles } from "../src/component-styles"
import { createCss } from "../src/core"
import { theme } from "../src/theme"

const target = new URL("../src/styles.gen.css", import.meta.url)

await writeFile(target, createCss(theme, componentStyles))
