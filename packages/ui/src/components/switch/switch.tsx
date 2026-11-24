"use client"

import type { ComponentProps, ReactNode } from "react"
import type { ComponentStyleProps } from "../../core/define"
import type { CheckableProps } from "../checkbox/checkbox-control"
import { splitStyleProps } from "../../core/split-style-props"
import { CheckableFrame, useCheckable } from "../checkbox/checkbox-control"
import { switchStyle } from "./switch.style"

export interface SwitchProps
  extends CheckableProps, ComponentStyleProps<typeof switchStyle> {
  /**
   * Toggles the switch when Enter is pressed.
   *
   * @default true
   */
  checkOnEnter?: boolean
  /** Content in the thumb, or separate content for the off and on states. */
  icon?: ReactNode | { off: ReactNode; on: ReactNode }
  /** Props for the decorative thumb. */
  thumbProps?: ComponentProps<"span">
  /** Props for the decorative track. */
  trackProps?: ComponentProps<"span">
}

export function Switch({
  size,
  checkOnEnter = true,
  icon,
  thumbProps,
  trackProps,
  ...props
}: SwitchProps) {
  const [attributes, rest] = splitStyleProps("switch", switchStyle, props)
  const control = useCheckable(rest, { size, checkOnEnter })
  const stateIcons =
    icon && typeof icon === "object" && "off" in icon && "on" in icon
      ? icon
      : undefined

  return (
    <CheckableFrame
      type="switch"
      attributes={attributes}
      control={control}
      indicator={
        <span {...trackProps} aria-hidden="true" data-part="track">
          <span {...thumbProps} data-part="thumb">
            {stateIcons ? (
              <>
                <span data-icon="off">{stateIcons.off}</span>
                <span data-icon="on">{stateIcons.on}</span>
              </>
            ) : (
              (icon as ReactNode)
            )}
          </span>
        </span>
      }
    />
  )
}
