import type { ComponentStyle } from "./core/types"
import { badgeStyle } from "./components/badge/badge.style"
import { buttonStyle } from "./components/button/button.style"
import { cardBodyStyle } from "./components/card/card-body.style"
import { cardFooterStyle } from "./components/card/card-footer.style"
import { cardHeaderStyle } from "./components/card/card-header.style"
import { cardStyle } from "./components/card/card.style"
import { checkboxStyle } from "./components/checkbox/checkbox.style"
import { containerStyle } from "./components/container/container.style"
import { fieldStyle } from "./components/field/field.style"
import { fieldsetStyle } from "./components/fieldset/fieldset.style"
import { gridStyle } from "./components/grid/grid.style"
import { headingStyle } from "./components/heading/heading.style"
import { inputStyle } from "./components/input/input.style"
import { linkStyle } from "./components/link/link.style"
import { radioGroupStyle } from "./components/radio/radio-group.style"
import { radioStyle } from "./components/radio/radio.style"
import { selectStyle } from "./components/select/select.style"
import { stackStyle } from "./components/stack/stack.style"
import { switchStyle } from "./components/switch/switch.style"
import { textStyle } from "./components/text/text.style"
import { textareaStyle } from "./components/textarea/textarea.style"
import { visuallyHiddenStyle } from "./components/visually-hidden/visually-hidden.style"

/** Every component style compiled into the stylesheet, keyed by folder name. */
export const componentStyles: { [key: string]: ComponentStyle } = {
  badge: badgeStyle,
  button: buttonStyle,
  card: cardStyle,
  "card-body": cardBodyStyle,
  "card-footer": cardFooterStyle,
  "card-header": cardHeaderStyle,
  checkbox: checkboxStyle,
  container: containerStyle,
  field: fieldStyle,
  fieldset: fieldsetStyle,
  grid: gridStyle,
  heading: headingStyle,
  input: inputStyle,
  link: linkStyle,
  radio: radioStyle,
  "radio-group": radioGroupStyle,
  select: selectStyle,
  stack: stackStyle,
  switch: switchStyle,
  text: textStyle,
  textarea: textareaStyle,
  "visually-hidden": visuallyHiddenStyle,
}
