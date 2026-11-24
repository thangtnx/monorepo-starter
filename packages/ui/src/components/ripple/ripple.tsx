"use client"

import type { ComponentProps } from "react"
import type { ComponentStyleProps } from "../../core/define"
import type { RippleItem } from "./use-ripple"
import { splitStyleProps } from "../../core/split-style-props"
import { rippleStyle } from "./ripple.style"

export interface RippleProps
  extends
    Omit<ComponentProps<"span">, "children" | "color">,
    ComponentStyleProps<typeof rippleStyle> {
  /** Active ripple waves produced by `useRipple`. */
  ripples: readonly RippleItem[]
  /** Called when a wave's animation completes. */
  onClear: (key: number) => void
  /**
   * If `true`, no ripple waves are rendered.
   *
   * @default false
   */
  disabled?: boolean
  /** CSS duration override for each expanding wave. */
  duration?: string
}

/** Renders expanding pointer-down ripple waves inside a positioned container. */
export function Ripple({
  style,
  disabled = false,
  duration,
  ripples,
  onClear,
  ...props
}: RippleProps) {
  const [styleAttributes, rest] = splitStyleProps("ripple", rippleStyle, props)

  if (disabled || ripples.length === 0) return null

  return (
    <span {...styleAttributes} {...rest} style={style} aria-hidden="true">
      {ripples.map((ripple) => {
        const waveVars: { [key: `--${string}`]: string } = {
          "--ripple-duration": duration ?? `${ripple.duration}ms`,
          "--ripple-size": `${ripple.size}px`,
          "--ripple-x": `${ripple.x}px`,
          "--ripple-y": `${ripple.y}px`,
        }
        return (
          <span
            key={ripple.key}
            style={waveVars}
            data-part="wave"
            data-state={ripple.released ? "released" : "active"}
            onTransitionEnd={(event) => {
              if (
                ripple.released &&
                (!event.propertyName || event.propertyName === "opacity")
              )
                onClear(ripple.key)
            }}
          />
        )
      })}
    </span>
  )
}
