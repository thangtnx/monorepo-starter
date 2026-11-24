import type { MouseEvent, ReactNode } from "react"
import type { Alert } from "../alert"
import type { NoticeCloseButtonProps } from "./notice-close-button"
import type { NoticeContentProps } from "./notice-content"
import { splitStyleProps } from "../../core/split-style-props"
import { AlertDescription, AlertLoading, AlertRoot, AlertTitle } from "../alert"
import { NoticeCloseButton } from "./notice-close-button"
import { NoticeContent } from "./notice-content"
import { noticeItemStyle } from "./notice-item.style"

export type NoticeCloseStrategy = "button" | "click" | "drag"

export interface NoticeItemProps extends Omit<
  Alert.RootProps,
  "onClose" | "title"
> {
  /** Allow dismissal through the selected strategies. @default false */
  closable?: boolean
  /** Presentation supports button and click. Toast owns drag dismissal. @default ["button", "click", "drag"] */
  closeStrategies?: readonly NoticeCloseStrategy[]
  /** Notification description. */
  description?: ReactNode
  /** Override the icon for this item. */
  icon?: ReactNode
  /** Replace the status icon with the selected loading indicator. */
  loadingScheme?: Alert.LoadingProps["loadingScheme"]
  /** Notification title. */
  title?: ReactNode
  /** Attributes of the close button. */
  closeButtonProps?: NoticeCloseButtonProps
  /** Attributes of the text content wrapper. */
  contentProps?: NoticeContentProps
  /** Attributes of the description. */
  descriptionProps?: Alert.DescriptionProps
  /** Attributes of the loading indicator. */
  loadingProps?: Alert.LoadingProps
  /** Attributes of the title. */
  titleProps?: Alert.TitleProps
  /** Invoked when the user dismisses the item. */
  onClose?: () => void
}

const defaultCloseStrategies = ["button", "click", "drag"] as const

export function NoticeItem({
  className,
  "aria-busy": busy,
  children,
  closable = false,
  closeStrategies = defaultCloseStrategies,
  description,
  icon,
  loadingScheme,
  title,
  withIcon = true,
  closeButtonProps,
  contentProps,
  descriptionProps,
  iconProps,
  loadingProps,
  titleProps,
  onClick,
  onClose,
  ...props
}: NoticeItemProps) {
  const [attributes] = splitStyleProps("notice-item", noticeItemStyle, {
    className,
  })
  const closeOnClick = closable && closeStrategies.includes("click")
  const showCloseButton = closable && closeStrategies.includes("button")

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    onClick?.(event)
    if (event.defaultPrevented || !closeOnClick) return
    const target = event.target
    const control =
      target instanceof Element &&
      target.closest(
        "button, a[href], input, select, textarea, [role='button'], [role='link']",
      )
    if (!control) onClose?.()
  }

  return (
    <AlertRoot
      {...props}
      {...attributes}
      aria-busy={loadingScheme ? true : busy}
      withIcon={withIcon && !loadingScheme}
      iconProps={icon == null ? iconProps : { ...iconProps, children: icon }}
      onClick={onClick || (closeOnClick && onClose) ? handleClick : undefined}
    >
      {withIcon && loadingScheme && (
        <AlertLoading loadingScheme={loadingScheme} {...loadingProps} />
      )}
      <NoticeContent {...contentProps}>
        {title != null && <AlertTitle {...titleProps}>{title}</AlertTitle>}
        {description != null && (
          <AlertDescription {...descriptionProps}>
            {description}
          </AlertDescription>
        )}
        {children}
      </NoticeContent>
      {showCloseButton && (
        <NoticeCloseButton
          {...closeButtonProps}
          onClick={
            onClose
              ? (event) => {
                  closeButtonProps?.onClick?.(event)
                  if (!event.defaultPrevented) onClose()
                }
              : closeButtonProps?.onClick
          }
        />
      )}
    </AlertRoot>
  )
}
