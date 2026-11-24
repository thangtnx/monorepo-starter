import type { Meta, StoryObj } from "@storybook/react-vite"
import { MotionSample, TokenTable } from "../../../.storybook/theme-samples"
import { durations } from "./durations"

const meta = { title: "Theme/Tokens/Durations" } satisfies Meta

export default meta

export const Samples: StoryObj<typeof meta> = {
  render: () => (
    <TokenTable
      category="durations"
      preview={(value) => <MotionSample duration={value} />}
      tokens={durations}
    />
  ),
}
