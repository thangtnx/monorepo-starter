import type { Meta, StoryObj } from "@storybook/react-vite"
import { use } from "react"
import { colorSchemes } from "../../theme/semantic-tokens/color-schemes"
import { Loading } from "./index"
const meta = {
  component: Loading.Indicator,
  title: "Components/Loading",
} satisfies Meta<typeof Loading.Indicator>

export default meta

type Story = StoryObj<typeof meta>

export const Indicators: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        fontSize: "var(--font-sizes-2xl)",
        gap: "var(--spaces-4)",
      }}
    >
      {Loading.schemes.map((scheme) => (
        <Loading.Indicator
          key={scheme}
          aria-label={`Loading, ${scheme}`}
          scheme={scheme}
        />
      ))}
    </div>
  ),
}

export const CustomDurationAndPaint: Story = {
  args: {
    duration: "2s",
    scheme: "rings",
    secondaryColor: "var(--colors-info-solid)",
  },
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
