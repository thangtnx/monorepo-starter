import type { ComponentProps, ReactElement, ReactNode } from "react"
import type { ComponentStyleProps } from "../../core/define"
import type { EmptyStateActionsProps } from "./empty-state-actions"
import type { EmptyStateContentProps } from "./empty-state-content"
import type { EmptyStateDescriptionProps } from "./empty-state-description"
import type { EmptyStateIndicatorProps } from "./empty-state-indicator"
import type { EmptyStateTitleProps } from "./empty-state-title"
import { Children, isValidElement } from "react"
import { splitStyleProps } from "../../core/split-style-props"
import { EmptyStateActions } from "./empty-state-actions"
import { EmptyStateContent } from "./empty-state-content"
import { EmptyStateDescription } from "./empty-state-description"
import { EmptyStateIndicator } from "./empty-state-indicator"
import { EmptyStateTitle } from "./empty-state-title"
import { emptyStateStyle } from "./empty-state.style"

export interface EmptyStateRootProps
  extends
    Omit<ComponentProps<"div">, "color" | "title">,
    ComponentStyleProps<typeof emptyStateStyle> {
  /** Actions available in the empty state. */
  actions?: ReactNode
  /** Content of the description. */
  description?: ReactNode
  /** Illustration or other leading content. */
  indicator?: ReactNode
  /** Content of the title. */
  title?: ReactNode
  /** Attributes of the generated actions. */
  actionsProps?: EmptyStateActionsProps
  /** Attributes of the generated content wrapper. */
  contentProps?: EmptyStateContentProps
  /** Attributes of the generated description. */
  descriptionProps?: EmptyStateDescriptionProps
  /** Attributes of the generated indicator. */
  indicatorProps?: EmptyStateIndicatorProps
  /** Attributes of the generated title. */
  titleProps?: EmptyStateTitleProps
}

export function EmptyStateRoot({
  actions,
  children,
  description,
  indicator,
  title,
  actionsProps,
  contentProps,
  descriptionProps,
  indicatorProps,
  titleProps,
  ...props
}: EmptyStateRootProps) {
  const [attributes, rest] = splitStyleProps(
    "empty-state",
    emptyStateStyle,
    props,
  )
  const parts = new Map<(typeof emptyStateParts)[number], ReactElement>()
  const remaining = Children.toArray(children).filter((child) => {
    if (!isValidElement(child)) return true
    const part = emptyStateParts.find((type) => child.type === type)
    if (!part || parts.has(part)) return true
    parts.set(part, child)
    return false
  })
  const customTitle = parts.get(EmptyStateTitle)
  const customDescription = parts.get(EmptyStateDescription)

  return (
    <div {...attributes} {...rest}>
      {parts.get(EmptyStateIndicator) ??
        (indicator != null && (
          <EmptyStateIndicator {...indicatorProps}>
            {indicator}
          </EmptyStateIndicator>
        ))}
      {parts.get(EmptyStateContent) ??
        ((customTitle ||
          customDescription ||
          title != null ||
          description != null) && (
          <EmptyStateContent {...contentProps}>
            {customTitle ??
              (title != null && (
                <EmptyStateTitle {...titleProps}>{title}</EmptyStateTitle>
              ))}
            {customDescription ??
              (description != null && (
                <EmptyStateDescription {...descriptionProps}>
                  {description}
                </EmptyStateDescription>
              ))}
          </EmptyStateContent>
        ))}
      {remaining}
      {parts.get(EmptyStateActions) ??
        (actions != null && (
          <EmptyStateActions {...actionsProps}>{actions}</EmptyStateActions>
        ))}
    </div>
  )
}

const emptyStateParts = [
  EmptyStateActions,
  EmptyStateContent,
  EmptyStateDescription,
  EmptyStateIndicator,
  EmptyStateTitle,
] as const
