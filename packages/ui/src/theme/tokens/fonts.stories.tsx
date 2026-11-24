import type { Meta, StoryObj } from "@storybook/react-vite"
import { TokenTable } from "../../../.storybook/theme-samples"
import { fonts } from "./fonts"

const meta = { title: "Theme / Tokens / Fonts" } satisfies Meta

export default meta

export const Samples: StoryObj<typeof meta> = {
  render: () => (
    <TokenTable
      category="fonts"
      preview={(value) => <span style={{ fontFamily: value }}>Aa Bb 123</span>}
      tokens={fonts}
    />
  ),
}
