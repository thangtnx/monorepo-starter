"use client"

import { createLoading, motionStyle } from "./loading"

export const LoadingAudio = createLoading({
  name: "audio",
  drawing: (
    <g>
      {[0, 15, 30, 45].map((x, index) => (
        <rect
          key={x}
          className="ui-loading-motion"
          style={motionStyle({
            "--loading-cycle": `calc(var(--loading-duration, 1.4s) * ${[3, 1.4, 1, 1.4][index]})`,
            "--loading-delay": `${[0, -0.7, -0.2, -1.1][index]}s`,
          })}
          height="80"
          rx="3"
          width="10"
          x={x}
        />
      ))}
    </g>
  ),
  fill: "currentColor",
  motion: motionStyle({
    "--loading-animation": "ui-loading-pulse linear infinite",
    "--loading-cycle": "var(--loading-duration, 1.4s)",
    "--loading-mid-transform": "scaleY(1)",
    "--loading-origin": "center bottom",
    "--loading-rest": "scaleY(.22)",
  }),
  viewBox: "0 0 55 80",
})
