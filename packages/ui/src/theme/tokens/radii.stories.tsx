import type { Meta, StoryObj } from "@storybook/react-vite"
import { Swatch, TokenTable } from "../../../.storybook/theme-samples"
import { radii } from "./radii"

const meta = { title: "Theme / Tokens / Radii" } satisfies Meta

export default meta

export const Samples: StoryObj<typeof meta> = {
  render: () => (
    <TokenTable
      category="radii"
      preview={(value) => (
        <Swatch color="var(--colors-primary-solid)" radius={value} />
      )}
      tokens={radii}
    />
  ),
}
