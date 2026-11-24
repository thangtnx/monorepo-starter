"use client"

import type { MotionBaseProps } from "./motion-presence"
import type { MotionStyle } from "./motion.style"
import { MotionFrame } from "./motion-presence"

export type SlidePlacement = keyof MotionStyle["props"]["placement"]

export interface SlideProps extends MotionBaseProps {
  /**
   * Edge of the viewport from which the panel slides in.
   *
   * @default "right"
   */
  placement?: SlidePlacement
}

/** Slides a fixed overlay panel in from a viewport edge. */
export function Slide({ placement = "right", ...props }: SlideProps) {
  return <MotionFrame {...props} placement={placement} preset="slide" />
}
