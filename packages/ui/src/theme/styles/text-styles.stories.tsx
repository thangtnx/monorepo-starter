import type { Meta, StoryObj } from "@storybook/react-vite"
import { StyleSamples } from "../../../.storybook/theme-samples"
import { textStyles } from "./text-styles"

const meta = { title: "Theme / Styles / Text styles" } satisfies Meta

export default meta

export const Samples: StoryObj<typeof meta> = {
  render: () => (
    <StyleSamples names={Object.keys(textStyles)} property="textStyle" />
  ),
}
