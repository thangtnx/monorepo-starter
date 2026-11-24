import type { Meta, StoryObj } from "@storybook/react-vite"
import { TokenTable } from "../../../.storybook/theme-samples"
import { fontSizes } from "./font-sizes"

const meta = { title: "Theme / Tokens / Font sizes" } satisfies Meta

export default meta

export const Samples: StoryObj<typeof meta> = {
  render: () => (
    <TokenTable
      category="fontSizes"
      preview={(value) => <span style={{ fontSize: value }}>Aa</span>}
      tokens={fontSizes}
    />
  ),
}
