import type { ComponentStyle } from "./core/types"
import { alertDescriptionStyle } from "./components/alert/alert-description.style"
import { alertIconStyle } from "./components/alert/alert-icon.style"
import { alertLoadingStyle } from "./components/alert/alert-loading.style"
import { alertTitleStyle } from "./components/alert/alert-title.style"
import { alertStyle } from "./components/alert/alert.style"
import { badgeStyle } from "./components/badge/badge.style"
import { buttonStyle } from "./components/button/button.style"
import { cardBodyStyle } from "./components/card/card-body.style"
import { cardFooterStyle } from "./components/card/card-footer.style"
import { cardHeaderStyle } from "./components/card/card-header.style"
import { cardStyle } from "./components/card/card.style"
import { checkboxStyle } from "./components/checkbox/checkbox.style"
import { circleProgressLabelStyle } from "./components/circle-progress/circle-progress-label.style"
import { circleProgressStyle } from "./components/circle-progress/circle-progress.style"
import { containerStyle } from "./components/container/container.style"
import { emptyStateActionsStyle } from "./components/empty-state/empty-state-actions.style"
import { emptyStateContentStyle } from "./components/empty-state/empty-state-content.style"
import { emptyStateDescriptionStyle } from "./components/empty-state/empty-state-description.style"
import { emptyStateIndicatorStyle } from "./components/empty-state/empty-state-indicator.style"
import { emptyStateTitleStyle } from "./components/empty-state/empty-state-title.style"
import { emptyStateStyle } from "./components/empty-state/empty-state.style"
import { fieldStyle } from "./components/field/field.style"
import { fieldsetStyle } from "./components/fieldset/fieldset.style"
import { gridStyle } from "./components/grid/grid.style"
import { headingStyle } from "./components/heading/heading.style"
import { inputStyle } from "./components/input/input.style"
import { linkStyle } from "./components/link/link.style"
import { loadingStyle } from "./components/loading/loading.style"
import { noticeCloseButtonStyle } from "./components/notice/notice-close-button.style"
import { noticeContentStyle } from "./components/notice/notice-content.style"
import { noticeItemStyle } from "./components/notice/notice-item.style"
import { noticeStyle } from "./components/notice/notice.style"
import { progressStyle } from "./components/progress/progress.style"
import { radioGroupStyle } from "./components/radio/radio-group.style"
import { radioStyle } from "./components/radio/radio.style"
import { selectStyle } from "./components/select/select.style"
import { skeletonTextStyle } from "./components/skeleton/skeleton-text.style"
import { skeletonStyle } from "./components/skeleton/skeleton.style"
import { stackStyle } from "./components/stack/stack.style"
import { switchStyle } from "./components/switch/switch.style"
import { textStyle } from "./components/text/text.style"
import { textareaStyle } from "./components/textarea/textarea.style"
import { visuallyHiddenStyle } from "./components/visually-hidden/visually-hidden.style"

/** Every component style compiled into the stylesheet, keyed by folder name. */
export const componentStyles: { [key: string]: ComponentStyle } = {
  alert: alertStyle,
  "alert-description": alertDescriptionStyle,
  "alert-icon": alertIconStyle,
  "alert-loading": alertLoadingStyle,
  "alert-title": alertTitleStyle,
  badge: badgeStyle,
  button: buttonStyle,
  card: cardStyle,
  "card-body": cardBodyStyle,
  "card-footer": cardFooterStyle,
  "card-header": cardHeaderStyle,
  checkbox: checkboxStyle,
  "circle-progress": circleProgressStyle,
  "circle-progress-label": circleProgressLabelStyle,
  container: containerStyle,
  "empty-state": emptyStateStyle,
  "empty-state-actions": emptyStateActionsStyle,
  "empty-state-content": emptyStateContentStyle,
  "empty-state-description": emptyStateDescriptionStyle,
  "empty-state-indicator": emptyStateIndicatorStyle,
  "empty-state-title": emptyStateTitleStyle,
  field: fieldStyle,
  fieldset: fieldsetStyle,
  grid: gridStyle,
  heading: headingStyle,
  input: inputStyle,
  link: linkStyle,
  loading: loadingStyle,
  notice: noticeStyle,
  "notice-close-button": noticeCloseButtonStyle,
  "notice-content": noticeContentStyle,
  "notice-item": noticeItemStyle,
  progress: progressStyle,
  radio: radioStyle,
  "radio-group": radioGroupStyle,
  select: selectStyle,
  skeleton: skeletonStyle,
  "skeleton-text": skeletonTextStyle,
  stack: stackStyle,
  switch: switchStyle,
  text: textStyle,
  textarea: textareaStyle,
  "visually-hidden": visuallyHiddenStyle,
}
