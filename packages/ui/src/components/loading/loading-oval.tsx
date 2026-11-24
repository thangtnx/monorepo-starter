"use client"

import { createLoading, motionStyle } from "./loading"

export const LoadingOval = createLoading({
  name: "oval",
  drawing: (
    <g strokeWidth="2">
      <circle className="ui-loading-oval-track" cx="19" cy="19" r="18" />
      <path className="ui-loading-motion" d="M37 19 A18 18 0 0 0 19 1" />
    </g>
  ),
  fill: "none",
  motion: motionStyle({
    "--loading-animation": "ui-feedback-spin linear infinite",
    "--loading-origin": "left bottom",
  }),
  stroke: "currentColor",
  viewBox: "0 0 38 38",
})
