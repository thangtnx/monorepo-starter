"use client"

import { createLoading, motionStyle } from "./loading"

export const LoadingRings = createLoading({
  name: "rings",
  drawing: (
    <g strokeWidth="2">
      {["-1.5s", "0s"].map((delay) => (
        <circle
          key={delay}
          className="ui-loading-motion"
          style={motionStyle({
            "--loading-delay": delay,
            "--loading-still": "scale(2.5)",
          })}
          cx="23"
          cy="23"
          r="6"
        />
      ))}
      <circle
        className="ui-loading-motion"
        style={motionStyle({
          "--loading-animation": "ui-loading-ring-center linear infinite",
          "--loading-cycle": "calc(var(--loading-duration, 3s) / 2)",
          "--loading-rest": "scale(.75)",
        })}
        cx="23"
        cy="23"
        r="8"
      />
    </g>
  ),
  fill: "none",
  motion: motionStyle({
    "--loading-animation": "ui-loading-ripple linear infinite",
    "--loading-cycle": "var(--loading-duration, 3s)",
    "--loading-end-stroke": 0,
    "--loading-end-transform": "scale(3.667)",
  }),
  stroke: "currentColor",
  viewBox: "0 0 45 45",
})
