"use client"

import { createLoading, motionStyle } from "../loading/loading"
import { LoaderCircle } from "./icons"

export const IconSpinner = createLoading({
  as: LoaderCircle,
  name: "icon-spinner",
  className: "ui-loading-motion",
  motion: motionStyle({
    "--loading-animation": "ui-feedback-spin linear infinite",
    "--loading-box": "view-box",
  }),
  stroke: "currentColor",
  viewBox: "0 0 24 24",
})
