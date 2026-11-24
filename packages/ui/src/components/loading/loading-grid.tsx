"use client"

import { createLoading, motionStyle } from "./loading"

export const LoadingGrid = createLoading({
  name: "grid",
  drawing: [
    [0, 3, 8],
    [1, 6, 4],
    [7, 5, 2],
  ].flatMap((row, y) =>
    row.map((step, x) => (
      <circle
        key={`${x}-${y}`}
        className="ui-loading-motion"
        style={motionStyle({ "--loading-delay": `${step / 10}s` })}
        cx={12.5 + 40 * x}
        cy={12.5 + 40 * y}
        r="12.5"
      />
    )),
  ),
  fill: "currentColor",
  motion: motionStyle({
    "--loading-animation": "ui-loading-pulse linear infinite",
    "--loading-mid-opacity": 0.2,
  }),
  viewBox: "0 0 105 105",
})
