import type { Meta, StoryObj } from "@storybook/react-vite"
import { use } from "react"
import { colorSchemes } from "../../theme/semantic-tokens/color-schemes"
import { Loading } from "./index"

const meta = {
  component: Loading.Oval,
  title: "Components/Loading",
} satisfies Meta<typeof Loading.Oval>

export default meta
type Story = StoryObj<typeof meta>

export const Audio: Story = { render: (args) => <Loading.Audio {...args} /> }
export const Circles: Story = {
  render: (args) => <Loading.Circles {...args} />,
}
export const Dots: Story = { render: (args) => <Loading.Dots {...args} /> }
export const Grid: Story = { render: (args) => <Loading.Grid {...args} /> }
export const Oval: Story = {}
export const Puff: Story = { render: (args) => <Loading.Puff {...args} /> }
export const Rings: Story = { render: (args) => <Loading.Rings {...args} /> }

export const CustomDurationAndPaint: Story = {
  args: { duration: "2s", secondaryColor: "info.solid" },
}

export const ColorSchemes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--spaces-4)" }}>
      {colorSchemes.map((colorScheme) => (
        <Loading.Dots key={colorScheme} colorScheme={colorScheme} />
      ))}
    </div>
  ),
}

const previewReady = new Promise<null>(() => {})

function PendingPreview() {
  return use(previewReady)
}

export const SuspenseFallback: Story = {
  render: () => (
    <Loading.Suspense
      loadingScheme="rings"
      loadingProps={{ "aria-label": "Preparing preview" }}
    >
      <PendingPreview />
    </Loading.Suspense>
  ),
}
