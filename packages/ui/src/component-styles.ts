import type { ComponentStyle } from "./core/types"
import { visuallyHiddenStyle } from "./components/visually-hidden/visually-hidden.style"

/** Every component style compiled into the stylesheet, keyed by folder name. */
export const componentStyles: { [key: string]: ComponentStyle } = {
  "visually-hidden": visuallyHiddenStyle,
}
