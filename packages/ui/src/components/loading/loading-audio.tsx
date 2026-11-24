import type { LoadingProps } from "./loading"
import { LoadingIndicator } from "./loading"

export interface LoadingAudioProps extends LoadingProps {}

export function LoadingAudio(props: LoadingAudioProps) {
  return <LoadingIndicator {...props} scheme="audio" />
}
