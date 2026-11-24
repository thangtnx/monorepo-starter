import type { Meta, StoryObj } from "@storybook/react-vite"
import { Swatch, TokenTable } from "../../../.storybook/theme-samples"
import { shadows } from "./shadows"

const meta = { title: "Theme/Semantic tokens/Shadows" } satisfies Meta

export default meta

export const Samples: StoryObj<typeof meta> = {
  render: () => (
    <TokenTable
      category="shadows"
      preview={(value) => (
        <Swatch color="var(--colors-bg-panel)" shadow={value} />
      )}
      tokens={shadows}
    />
  ),
}
