import type { Meta, StoryObj } from "@storybook/react-vite"
import { TokenBar, TokenTable } from "../../../.storybook/theme-samples"
import { breakpoints } from "./breakpoints"

const meta = { title: "Theme/Tokens/Breakpoints" } satisfies Meta

export default meta

export const Samples: StoryObj<typeof meta> = {
  render: () => (
    <TokenTable
      category="breakpoints"
      preview={(value) => <TokenBar width={value} />}
      tokens={breakpoints}
    />
  ),
}
