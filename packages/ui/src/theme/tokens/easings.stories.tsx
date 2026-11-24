import type { Meta, StoryObj } from "@storybook/react-vite"
import { MotionSample, TokenTable } from "../../../.storybook/theme-samples"
import { easings } from "./easings"

const meta = { title: "Theme/Tokens/Easings" } satisfies Meta

export default meta

export const Samples: StoryObj<typeof meta> = {
  render: () => (
    <TokenTable
      category="easings"
      preview={(value) => <MotionSample easing={value} />}
      tokens={easings}
    />
  ),
}
