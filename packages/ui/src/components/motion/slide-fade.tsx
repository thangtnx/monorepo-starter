"use client"

import type { MotionBaseProps } from "./motion-presence"
import { MotionFrame } from "./motion-presence"

export interface SlideFadeProps extends MotionBaseProps {
  /**
   * Horizontal offset when closed.
   *
   * @default "0px"
   */
  offsetX?: string
  /**
   * Vertical offset when closed.
   *
   * @default "8px"
   */
  offsetY?: string
}

/** Transitions translation offset and opacity between open and closed states. */
export function SlideFade({ offsetX, offsetY, ...props }: SlideFadeProps) {
  const vars: { [key: `--${string}`]: string } = {}
  if (offsetX !== undefined) vars["--motion-x"] = offsetX
  if (offsetY !== undefined) vars["--motion-y"] = offsetY

  return <MotionFrame {...props} preset="slide-fade" vars={vars} />
}
