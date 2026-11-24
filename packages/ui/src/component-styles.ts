import type { ComponentStyle } from "./core/types"
import { badgeStyle } from "./components/badge/badge.style"
import { buttonStyle } from "./components/button/button.style"
import { visuallyHiddenStyle } from "./components/visually-hidden/visually-hidden.style"

/** Every component style compiled into the stylesheet, keyed by folder name. */
export const componentStyles: { [key: string]: ComponentStyle } = {
  badge: badgeStyle,
  button: buttonStyle,
  "visually-hidden": visuallyHiddenStyle,
}
