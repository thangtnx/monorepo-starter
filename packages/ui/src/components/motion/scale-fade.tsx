"use client"

import type { MotionBaseProps } from "./motion-presence"
import { MotionFrame } from "./motion-presence"

export interface ScaleFadeProps extends MotionBaseProps {
  /**
   * Starting scale factor when closed.
   *
   * @default 0.95
   */
  initialScale?: number
}

/** Transitions scale and opacity together between open and closed states. */
export function ScaleFade({ initialScale, ...props }: ScaleFadeProps) {
  return (
    <MotionFrame
      {...props}
      preset="scale-fade"
      vars={
        initialScale !== undefined
          ? { "--motion-scale": initialScale }
          : undefined
      }
    />
  )
}
