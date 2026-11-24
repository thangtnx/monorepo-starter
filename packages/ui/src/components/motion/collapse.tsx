"use client"

import type { MotionBaseProps } from "./motion-presence"
import { MotionFrame } from "./motion-presence"

export interface CollapseProps extends MotionBaseProps {
  /**
   * If `true`, opacity transitions alongside the block size.
   *
   * @default true
   */
  animateOpacity?: boolean
  /**
   * Collapsed block size when closed.
   *
   * @default "0px"
   */
  startingHeight?: string
}

/** Expands and collapses its content vertically between closed and open states. */
export function Collapse({
  animateOpacity = true,
  children,
  startingHeight,
  ...props
}: CollapseProps) {
  return (
    <MotionFrame
      {...props}
      animateOpacity={animateOpacity}
      preset="collapse"
      vars={
        startingHeight !== undefined
          ? { "--motion-start-height": startingHeight }
          : undefined
      }
    >
      <div data-part="collapse-inner">{children}</div>
    </MotionFrame>
  )
}
