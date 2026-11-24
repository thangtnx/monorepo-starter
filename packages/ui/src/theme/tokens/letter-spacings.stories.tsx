import type { Meta, StoryObj } from "@storybook/react-vite"
import { TokenTable } from "../../../.storybook/theme-samples"
import { letterSpacings } from "./letter-spacings"

const meta = { title: "Theme / Tokens / Letter spacings" } satisfies Meta

export default meta

export const Samples: StoryObj<typeof meta> = {
  render: () => (
    <TokenTable
      category="letterSpacings"
      preview={(value) => (
        <span style={{ letterSpacing: value }}>Sample text</span>
      )}
      tokens={letterSpacings}
    />
  ),
}
