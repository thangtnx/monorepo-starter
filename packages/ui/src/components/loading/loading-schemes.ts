import { LoadingAudio } from "./loading-audio"
import { LoadingCircles } from "./loading-circles"
import { LoadingDots } from "./loading-dots"
import { LoadingGrid } from "./loading-grid"
import { LoadingOval } from "./loading-oval"
import { LoadingPuff } from "./loading-puff"
import { LoadingRings } from "./loading-rings"

export const loadingSchemes = {
  audio: LoadingAudio,
  circles: LoadingCircles,
  dots: LoadingDots,
  grid: LoadingGrid,
  oval: LoadingOval,
  puff: LoadingPuff,
  rings: LoadingRings,
} as const

export type LoadingScheme = keyof typeof loadingSchemes

export function isLoadingScheme(value: unknown): value is LoadingScheme {
  return typeof value === "string" && Object.hasOwn(loadingSchemes, value)
}
