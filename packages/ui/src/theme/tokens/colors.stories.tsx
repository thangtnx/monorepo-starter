import type { Meta, StoryObj } from "@storybook/react-vite"
import { Swatch, TokenTable } from "../../../.storybook/theme-samples"
import { colors } from "./colors"

const meta = { title: "Theme / Tokens / Colors" } satisfies Meta

export default meta

export const Samples: StoryObj<typeof meta> = {
  render: () => (
    <TokenTable
      category="colors"
      preview={(value) => <Swatch color={value} />}
      tokens={colors}
    />
  ),
}
