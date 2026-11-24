import type { ComponentProps } from "react"
import { splitStyleProps } from "../../core/split-style-props"
import { Icon, X } from "../icon"
import { noticeCloseButtonStyle } from "./notice-close-button.style"
import { noticeDefaults } from "./notice-config"

export interface NoticeCloseButtonProps extends Omit<
  ComponentProps<"button">,
  "type"
> {}

export function NoticeCloseButton({
  "aria-label": label,
  "aria-labelledby": labelledBy,
  children = <Icon as={X} />,
  ...props
}: NoticeCloseButtonProps) {
  const [attributes, rest] = splitStyleProps(
    "notice-close-button",
    noticeCloseButtonStyle,
    props,
  )
  return (
    <button
      type="button"
      {...attributes}
      {...rest}
      aria-label={label ?? (labelledBy ? undefined : noticeDefaults.closeLabel)}
      aria-labelledby={labelledBy}
    >
      {children}
    </button>
  )
}
