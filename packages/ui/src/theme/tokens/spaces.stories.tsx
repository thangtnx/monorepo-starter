import type { Meta, StoryObj } from "@storybook/react-vite"
import { TokenBar, TokenTable } from "../../../.storybook/theme-samples"
import { spaces } from "./spaces"

const meta = { title: "Theme / Tokens / Spaces" } satisfies Meta

export default meta

export const Samples: StoryObj<typeof meta> = {
  render: () => (
    <TokenTable
      category="spaces"
      preview={(value) => <TokenBar width={value} />}
      tokens={spaces}
    />
  ),
}
