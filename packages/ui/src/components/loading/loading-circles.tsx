"use client"

import { createLoading, motionStyle } from "./loading"

const flash = "ui-loading-circle-flash infinite"

export const LoadingCircles = createLoading({
  name: "circles",
  drawing: Array.from({ length: 8 }, (_, index) => {
    const angle = ((index + 1) * Math.PI) / 4
    return (
      <circle
        key={index}
        className="ui-loading-motion"
        style={motionStyle({
          "--loading-delay": `${index * 0.375}s`,
          // Invert the interpolation for the circle that is filled at rest.
          ...(index === 0
            ? {
                "--loading-animation": `${flash} linear(1, 0 12.5%, 1 25%, 1)`,
                "--loading-flash-fill": 0,
              }
            : {}),
        })}
        cx={Number((29 + 22 * Math.sin(angle)).toFixed(3))}
        cy={Number((28 - 22 * Math.cos(angle)).toFixed(3))}
        fill="currentColor"
        fillOpacity={index === 0 ? 1 : 0}
        r="5"
        strokeWidth="1.5"
      />
    )
  }),
  fill: "none",
  motion: motionStyle({
    "--loading-animation": `${flash} linear(0, 1 12.5%, 0 25%, 0)`,
    "--loading-cycle": "var(--loading-duration, 3s)",
  }),
  stroke: "currentColor",
  viewBox: "0 0 58 58",
})
