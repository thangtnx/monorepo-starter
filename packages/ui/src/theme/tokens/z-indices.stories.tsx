import type { Meta, StoryObj } from "@storybook/react-vite"
import { StackSample, TokenTable } from "../../../.storybook/theme-samples"
import { zIndices } from "./z-indices"

const meta = { title: "Theme/Tokens/Z-indices" } satisfies Meta

export default meta

export const Samples: StoryObj<typeof meta> = {
  render: () => (
    <TokenTable
      category="zIndices"
      preview={(value) => <StackSample zIndex={value} />}
      tokens={zIndices}
    />
  ),
}
