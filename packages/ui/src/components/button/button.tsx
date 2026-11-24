import type { ComponentProps, ReactNode } from "react"
import type { ComponentStyleProps } from "../../core/define"
import type { LoadingProps, LoadingScheme } from "../loading"
import { splitStyleProps } from "../../core/split-style-props"
import { IconSpinner } from "../icon/icon-spinner"
import { isLoadingScheme, loadingSchemes } from "../loading/loading-schemes"
import { buttonStyle } from "./button.style"

export interface ButtonProps
  extends
    Omit<ComponentProps<"button">, "color">,
    ComponentStyleProps<typeof buttonStyle> {
  /** Decorative icon after the label. */
  endIcon?: ReactNode
  /** Disable interaction and display a loading indicator. @default false */
  loading?: boolean
  /** Built-in loading scheme or a custom loading indicator. Defaults to the spinner icon. */
  loadingIcon?: LoadingScheme | ReactNode
  /** Place the indicator before or after the label. @default "start" */
  loadingPlacement?: "end" | "start"
  /** Replace the button's visible label while loading. */
  loadingText?: ReactNode
  /** Decorative icon before the label. */
  startIcon?: ReactNode
  /**
   * The button type. Defaults to `button` so it never submits a form by accident.
   *
   * @default "button"
   */
  type?: "button" | "reset" | "submit"
  /** Attributes forwarded to a built-in loading indicator. */
  loadingProps?: LoadingProps
}

/** A native button styled by variant, size and color scheme. */
export function Button({
  type = "button",
  children,
  disabled,
  endIcon,
  loading = false,
  loadingIcon,
  loadingPlacement = "start",
  loadingText,
  startIcon,
  loadingProps,
  ...props
}: ButtonProps) {
  const [styleAttributes, rest] = splitStyleProps("button", buttonStyle, props)
  const Indicator =
    loadingIcon === undefined
      ? IconSpinner
      : isLoadingScheme(loadingIcon)
        ? loadingSchemes[loadingIcon]
        : undefined
  const indicator = loading && loadingIcon !== null && (
    <span
      className="ui-button-loading-indicator"
      aria-hidden={Indicator ? undefined : true}
    >
      {Indicator ? <Indicator decorative {...loadingProps} /> : loadingIcon}
    </span>
  )
  const keepLabel = loading && loadingText == null

  // oxlint-disable-next-line react/button-has-type -- the prop is typed to valid values
  return (
    <button
      type={type}
      {...styleAttributes}
      {...rest}
      aria-busy={loading || rest["aria-busy"]}
      data-loading-overlay={keepLabel || undefined}
      data-loading-placement={loading ? loadingPlacement : undefined}
      disabled={disabled || loading}
    >
      {loadingPlacement === "start" && indicator}
      {loading && !keepLabel ? (
        loadingText
      ) : (
        <span className="ui-button-loading-label">
          {startIcon != null && (
            <span className="ui-button-icon" aria-hidden="true">
              {startIcon}
            </span>
          )}
          {children}
          {endIcon != null && (
            <span className="ui-button-icon" aria-hidden="true">
              {endIcon}
            </span>
          )}
        </span>
      )}
      {loadingPlacement === "end" && indicator}
    </button>
  )
}
