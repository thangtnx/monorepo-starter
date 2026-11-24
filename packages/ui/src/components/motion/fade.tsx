"use client"

import type { MotionBaseProps } from "./motion-presence"
import { MotionFrame } from "./motion-presence"

export interface FadeProps extends MotionBaseProps {}

/** Transitions opacity between open and closed states. */
export function Fade(props: FadeProps) {
  return <MotionFrame {...props} preset="fade" />
}
