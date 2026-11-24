import type { ComponentProps, ReactNode } from "react"
import type { ComponentStyleProps } from "../../core/define"
import type { LoadingProps, LoadingScheme } from "../loading"
import { splitStyleProps } from "../../core/split-style-props"
import { isLoadingScheme, loadingSchemes } from "../loading/loading-schemes"
import { buttonStyle } from "./button.style"

export interface ButtonProps
  extends
    Omit<ComponentProps<"button">, "color">,
    ComponentStyleProps<typeof buttonStyle> {
  /** Disable interaction and display a loading indicator. @default false */
  loading?: boolean
  /** Built-in loading scheme or a custom loading indicator. @default "oval" */
  loadingIcon?: LoadingScheme | ReactNode
  /** Place the indicator before or after the label. @default "start" */
  loadingPlacement?: "end" | "start"
  /** Replace the button's visible label while loading. */
  loadingText?: ReactNode
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
  loading = false,
  loadingIcon = "oval",
  loadingPlacement = "start",
  loadingText,
  loadingProps,
  ...props
}: ButtonProps) {
  const [styleAttributes, rest] = splitStyleProps("button", buttonStyle, props)
  const Indicator = isLoadingScheme(loadingIcon)
    ? loadingSchemes[loadingIcon]
    : undefined
  const indicator = loading && loadingIcon != null && (
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
      {keepLabel ? (
        <span className="ui-button-loading-label">{children}</span>
      ) : loading ? (
        loadingText
      ) : (
        children
      )}
      {loadingPlacement === "end" && indicator}
    </button>
  )
}
