"use client"

import { createLoading, motionStyle } from "./loading"

export const LoadingPuff = createLoading({
  name: "puff",
  drawing: (
    <g strokeWidth="2">
      {["0s", "-.9s"].map((delay) => (
        <circle
          key={delay}
          className="ui-loading-motion"
          style={motionStyle({ "--loading-delay": delay })}
          cx="22"
          cy="22"
          r="1"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </g>
  ),
  fill: "none",
  motion: motionStyle({
    "--loading-animation":
      "ui-loading-ripple cubic-bezier(.3, .61, .355, 1) infinite",
    "--loading-cycle": "var(--loading-duration, 1.8s)",
    "--loading-still": "scale(12)",
  }),
  stroke: "currentColor",
  viewBox: "0 0 44 44",
})
