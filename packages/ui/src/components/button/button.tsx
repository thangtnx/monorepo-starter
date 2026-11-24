import type { ComponentProps } from "react"
import type { ComponentStyleProps } from "../../core/define"
import { splitStyleProps } from "../../core/split-style-props"
import { buttonStyle } from "./button.style"

export interface ButtonProps
  extends
    Omit<ComponentProps<"button">, "color">,
    ComponentStyleProps<typeof buttonStyle> {
  /**
   * The button type. Defaults to `button` so it never submits a form by accident.
   *
   * @default "button"
   */
  type?: "button" | "reset" | "submit"
}

/** A native button styled by variant, size and color scheme. */
export function Button({ type = "button", ...props }: ButtonProps) {
  const [styleAttributes, rest] = splitStyleProps("button", buttonStyle, props)

  // oxlint-disable-next-line react/button-has-type -- the prop is typed to valid values
  return <button type={type} {...styleAttributes} {...rest} />
}
