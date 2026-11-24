import type { Meta, StoryObj } from "@storybook/react-vite"
import { StyleSamples } from "../../../.storybook/theme-samples"
import { layerStyles } from "./layer-styles"

const meta = { title: "Theme / Styles / Layer styles" } satisfies Meta

export default meta

export const Samples: StoryObj<typeof meta> = {
  render: () => (
    <StyleSamples names={Object.keys(layerStyles)} property="layerStyle" />
  ),
}
