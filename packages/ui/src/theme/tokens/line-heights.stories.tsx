import type { Meta, StoryObj } from "@storybook/react-vite"
import { TokenTable } from "../../../.storybook/theme-samples"
import { lineHeights } from "./line-heights"

const meta = { title: "Theme/Tokens/Line heights" } satisfies Meta

export default meta

export const Samples: StoryObj<typeof meta> = {
  render: () => (
    <TokenTable
      category="lineHeights"
      preview={(value) => (
        <span style={{ lineHeight: value }}>
          First line
          <br />
          Second line
        </span>
      )}
      tokens={lineHeights}
    />
  ),
}
