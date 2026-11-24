"use client"

import type { ComponentProps, TransitionEvent } from "react"
import type { ComponentStyleProps } from "../../core/define"
import type { MotionStyle } from "./motion.style"
import { useCallback, useEffect, useState } from "react"
import { splitStyleProps } from "../../core/split-style-props"
import { motionStyle } from "./motion.style"

export type MotionTiming = string | { enter?: string; exit?: string }

export interface MotionBaseProps
  extends
    Omit<ComponentProps<"div">, "color">,
    Omit<ComponentStyleProps<MotionStyle>, "placement" | "preset"> {
  /** CSS delay for enter and exit transitions. */
  delay?: MotionTiming
  /** CSS duration override for enter and exit transitions. */
  duration?: MotionTiming
  /**
   * Controls whether the element is shown in its open state.
   *
   * @default false
   */
  open?: boolean
  /**
   * If `true`, unmounts the element after the exit transition finishes.
   *
   * @default false
   */
  unmountOnExit?: boolean
}

function applyTiming(
  vars: { [key: `--${string}`]: number | string },
  kind: "delay" | "duration",
  timing: MotionTiming | undefined,
) {
  if (timing === undefined) return
  if (typeof timing === "string") {
    vars[`--motion-enter-${kind}`] = timing
    vars[`--motion-exit-${kind}`] = timing
    return
  }
  if (timing.enter !== undefined) vars[`--motion-enter-${kind}`] = timing.enter
  if (timing.exit !== undefined) vars[`--motion-exit-${kind}`] = timing.exit
}

export function useMotionPresence(open: boolean, unmountOnExit: boolean) {
  const [mounted, setMounted] = useState(open)

  useEffect(() => {
    if (open) {
      setMounted(true)
      return
    }
    if (!unmountOnExit || !mounted) return
    const timer = setTimeout(() => setMounted(false), 600)
    return () => clearTimeout(timer)
  }, [mounted, open, unmountOnExit])

  const isMounted = !unmountOnExit || open || mounted

  const handleTransitionEnd = useCallback(
    (event: TransitionEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget && !open && unmountOnExit)
        setMounted(false)
    },
    [open, unmountOnExit],
  )

  return { isMounted, onTransitionEnd: handleTransitionEnd }
}

interface MotionFrameProps extends MotionBaseProps {
  preset: keyof typeof motionStyle.props.preset
  animateOpacity?: boolean
  placement?: keyof typeof motionStyle.props.placement
  vars?: { [key: `--${string}`]: number | string }
}

export function MotionFrame({
  style,
  animateOpacity,
  delay,
  duration,
  open = false,
  placement,
  preset,
  unmountOnExit = false,
  vars,
  onTransitionEnd,
  ...props
}: MotionFrameProps) {
  const { isMounted, onTransitionEnd: handlePresenceTransitionEnd } =
    useMotionPresence(open, unmountOnExit)

  const [styleAttributes, rest] = splitStyleProps("motion", motionStyle, {
    ...props,
    placement,
    preset,
  })

  if (!isMounted) return null

  const motionVars: { [key: `--${string}`]: number | string } = { ...vars }
  applyTiming(motionVars, "duration", duration)
  applyTiming(motionVars, "delay", delay)

  const hasVars = Object.keys(motionVars).length > 0
  const startHeight = vars?.["--motion-start-height"]
  const hasStartingHeight =
    startHeight !== undefined &&
    startHeight !== "0px" &&
    startHeight !== "0" &&
    startHeight !== 0

  return (
    <div
      {...styleAttributes}
      {...rest}
      style={hasVars || style ? { ...motionVars, ...style } : undefined}
      data-animate-opacity={
        animateOpacity !== undefined ? String(animateOpacity) : undefined
      }
      data-state={open ? "open" : "closed"}
      inert={!open && !hasStartingHeight ? true : undefined}
      onTransitionEnd={(event) => {
        onTransitionEnd?.(event)
        handlePresenceTransitionEnd(event)
      }}
    />
  )
}
