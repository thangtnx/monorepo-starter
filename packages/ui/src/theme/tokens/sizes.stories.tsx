import type { Meta, StoryObj } from "@storybook/react-vite"
import { TokenBar, TokenTable } from "../../../.storybook/theme-samples"
import { sizes } from "./sizes"

const meta = { title: "Theme / Tokens / Sizes" } satisfies Meta

export default meta

export const Samples: StoryObj<typeof meta> = {
  render: () => (
    <TokenTable
      category="sizes"
      preview={(value) => <TokenBar width={value} />}
      tokens={sizes}
    />
  ),
}
