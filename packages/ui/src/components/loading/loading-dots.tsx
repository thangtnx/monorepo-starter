"use client"

import { createLoading, motionStyle } from "./loading"

export const LoadingDots = createLoading({
  name: "dots",
  drawing: [15, 60, 105].map((x) => (
    <circle
      key={x}
      className="ui-loading-motion"
      style={
        x === 60
          ? motionStyle({
              "--loading-animation": "ui-loading-pulse linear infinite",
              "--loading-mid-opacity": 1,
              "--loading-mid-transform": "scale(1.667)",
            })
          : undefined
      }
      cx={x}
      cy="15"
      opacity={x === 60 ? 0.5 : 1}
      r={x === 60 ? 9 : 15}
    />
  )),
  fill: "currentColor",
  motion: motionStyle({
    "--loading-animation": "ui-loading-pulse linear infinite",
    "--loading-mid-opacity": 0.5,
    "--loading-mid-transform": "scale(.6)",
  }),
  viewBox: "0 0 120 30",
})
