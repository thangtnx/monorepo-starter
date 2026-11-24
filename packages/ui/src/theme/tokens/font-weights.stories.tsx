import type { Meta, StoryObj } from "@storybook/react-vite"
import { TokenTable } from "../../../.storybook/theme-samples"
import { fontWeights } from "./font-weights"

const meta = { title: "Theme/Tokens/Font weights" } satisfies Meta

export default meta

export const Samples: StoryObj<typeof meta> = {
  render: () => (
    <TokenTable
      category="fontWeights"
      preview={(value) => (
        <span style={{ fontWeight: value }}>Sample text</span>
      )}
      tokens={fontWeights}
    />
  ),
}
