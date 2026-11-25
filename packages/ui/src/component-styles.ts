import type { ComponentRecipe } from "./core/types"
import { alertDescriptionStyle } from "./components/alert/alert-description.style"
import { alertIconStyle } from "./components/alert/alert-icon.style"
import { alertLoadingStyle } from "./components/alert/alert-loading.style"
import { alertTitleStyle } from "./components/alert/alert-title.style"
import { alertStyle } from "./components/alert/alert.style"
import { badgeStyle } from "./components/badge/badge.style"
import { buttonStyle } from "./components/button/button.style"
import { cardStyle } from "./components/card/card.style"
import { checkableGroupStyle } from "./components/checkbox/checkable-group.style"
import { checkableStyle } from "./components/checkbox/checkable.style"
import { checkboxStyle } from "./components/checkbox/checkbox.style"
import { circleProgressLabelStyle } from "./components/circle-progress/circle-progress-label.style"
import { circleProgressStyle } from "./components/circle-progress/circle-progress.style"
import { containerStyle } from "./components/container/container.style"
import { dialogStyle } from "./components/dialog/dialog.style"
import { drawerStyle } from "./components/drawer/drawer.style"
import { emptyStateActionsStyle } from "./components/empty-state/empty-state-actions.style"
import { emptyStateContentStyle } from "./components/empty-state/empty-state-content.style"
import { emptyStateDescriptionStyle } from "./components/empty-state/empty-state-description.style"
import { emptyStateIndicatorStyle } from "./components/empty-state/empty-state-indicator.style"
import { emptyStateTitleStyle } from "./components/empty-state/empty-state-title.style"
import { emptyStateStyle } from "./components/empty-state/empty-state.style"
import { fieldStyle } from "./components/field/field.style"
import { fieldsetStyle } from "./components/fieldset/fieldset.style"
import { gridItemStyle } from "./components/grid/grid-item.style"
import { gridStyle } from "./components/grid/grid.style"
import { headingStyle } from "./components/heading/heading.style"
import { iconStyle } from "./components/icon/icon.style"
import { inputStyle } from "./components/input/input.style"
import { linkStyle } from "./components/link/link.style"
import { loadingLayerStyle } from "./components/loading/loading-layer.style"
import { loadingRegionStyle } from "./components/loading/loading-region.style"
import { loadingSuspenseStyle } from "./components/loading/loading-suspense.style"
import { loadingStyle } from "./components/loading/loading.style"
import { motionStyle } from "./components/motion/motion.style"
import { noticeCloseButtonStyle } from "./components/notice/notice-close-button.style"
import { noticeContentStyle } from "./components/notice/notice-content.style"
import { noticeItemStyle } from "./components/notice/notice-item.style"
import { noticeStyle } from "./components/notice/notice.style"
import { paginationStyle } from "./components/pagination/pagination.style"
import { progressPaintStyle } from "./components/progress/progress-paint.style"
import { progressStyle } from "./components/progress/progress.style"
import { radioStyle } from "./components/radio/radio.style"
import { rippleStyle } from "./components/ripple/ripple.style"
import { selectListboxStyle } from "./components/select/select-listbox.style"
import { selectRootStyle } from "./components/select/select-root.style"
import { selectStyle } from "./components/select/select.style"
import { skeletonTextStyle } from "./components/skeleton/skeleton-text.style"
import { skeletonStyle } from "./components/skeleton/skeleton.style"
import { stackStyle } from "./components/stack/stack.style"
import { switchStyle } from "./components/switch/switch.style"
import { tableStyle } from "./components/table/table.style"
import { tabsStyle } from "./components/tabs/tabs.style"
import { textStyle } from "./components/text/text.style"
import { textareaStyle } from "./components/textarea/textarea.style"
import { visuallyHiddenStyle } from "./components/visually-hidden/visually-hidden.style"

/** Every component style compiled into the stylesheet, keyed by folder name. */
export const componentStyles: { [key: string]: ComponentRecipe } = {
  alert: alertStyle,
  "alert-description": alertDescriptionStyle,
  "alert-icon": alertIconStyle,
  "alert-loading": alertLoadingStyle,
  "alert-title": alertTitleStyle,
  badge: badgeStyle,
  button: buttonStyle,
  card: cardStyle,
  checkable: checkableStyle,
  "checkable-group": checkableGroupStyle,
  checkbox: checkboxStyle,
  "circle-progress": circleProgressStyle,
  "circle-progress-label": circleProgressLabelStyle,
  container: containerStyle,
  dialog: dialogStyle,
  drawer: drawerStyle,
  "empty-state": emptyStateStyle,
  "empty-state-actions": emptyStateActionsStyle,
  "empty-state-content": emptyStateContentStyle,
  "empty-state-description": emptyStateDescriptionStyle,
  "empty-state-indicator": emptyStateIndicatorStyle,
  "empty-state-title": emptyStateTitleStyle,
  field: fieldStyle,
  fieldset: fieldsetStyle,
  grid: gridStyle,
  "grid-item": gridItemStyle,
  heading: headingStyle,
  icon: iconStyle,
  input: inputStyle,
  link: linkStyle,
  loading: loadingStyle,
  "loading-layer": loadingLayerStyle,
  "loading-region": loadingRegionStyle,
  "loading-suspense": loadingSuspenseStyle,
  motion: motionStyle,
  notice: noticeStyle,
  "notice-close-button": noticeCloseButtonStyle,
  "notice-content": noticeContentStyle,
  "notice-item": noticeItemStyle,
  pagination: paginationStyle,
  progress: progressStyle,
  "progress-paint": progressPaintStyle,
  radio: radioStyle,
  ripple: rippleStyle,
  select: selectStyle,
  "select-listbox": selectListboxStyle,
  "select-root": selectRootStyle,
  skeleton: skeletonStyle,
  "skeleton-text": skeletonTextStyle,
  stack: stackStyle,
  switch: switchStyle,
  table: tableStyle,
  tabs: tabsStyle,
  text: textStyle,
  textarea: textareaStyle,
  "visually-hidden": visuallyHiddenStyle,
}
