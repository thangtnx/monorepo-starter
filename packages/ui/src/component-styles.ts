import type { ComponentStyle } from "./core/types"
import { badgeStyle } from "./components/badge/badge.style"
import { buttonStyle } from "./components/button/button.style"
import { checkboxStyle } from "./components/checkbox/checkbox.style"
import { fieldStyle } from "./components/field/field.style"
import { inputStyle } from "./components/input/input.style"
import { radioGroupStyle } from "./components/radio/radio-group.style"
import { radioStyle } from "./components/radio/radio.style"
import { selectStyle } from "./components/select/select.style"
import { switchStyle } from "./components/switch/switch.style"
import { textareaStyle } from "./components/textarea/textarea.style"
import { visuallyHiddenStyle } from "./components/visually-hidden/visually-hidden.style"

/** Every component style compiled into the stylesheet, keyed by folder name. */
export const componentStyles: { [key: string]: ComponentStyle } = {
  badge: badgeStyle,
  button: buttonStyle,
  checkbox: checkboxStyle,
  field: fieldStyle,
  input: inputStyle,
  radio: radioStyle,
  "radio-group": radioGroupStyle,
  select: selectStyle,
  switch: switchStyle,
  textarea: textareaStyle,
  "visually-hidden": visuallyHiddenStyle,
}
