import type { ComponentProps } from "react"
import { splitStyleProps } from "../../core/split-style-props"
import { noticeContentStyle } from "./notice-content.style"

export interface NoticeContentProps extends ComponentProps<"div"> {}

export function NoticeContent(props: NoticeContentProps) {
  const [attributes, rest] = splitStyleProps(
    "notice-content",
    noticeContentStyle,
    props,
  )
  return <div {...attributes} {...rest} />
}
