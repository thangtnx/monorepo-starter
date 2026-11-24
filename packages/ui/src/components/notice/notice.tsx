import type { ComponentProps } from "react"
import { splitStyleProps } from "../../core/split-style-props"
import { noticeDefaults } from "./notice-config"
import { noticeStyle } from "./notice.style"

export interface NoticeRootProps extends ComponentProps<"div"> {}

export function NoticeRoot({
  "aria-label": label,
  "aria-labelledby": labelledBy,
  ...props
}: NoticeRootProps) {
  const [attributes, rest] = splitStyleProps("notice", noticeStyle, props)
  return (
    <div
      aria-label={
        label ?? (labelledBy ? undefined : noticeDefaults.regionLabel)
      }
      aria-labelledby={labelledBy}
      role="region"
      {...attributes}
      {...rest}
    />
  )
}
