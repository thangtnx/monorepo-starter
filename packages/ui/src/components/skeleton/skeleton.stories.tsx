import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"
import { Skeleton, SkeletonCircle, SkeletonText } from "./index"
const meta = {
  component: Skeleton,
  title: "Components/Skeleton",
} satisfies Meta<typeof Skeleton>

export default meta

type Story = StoryObj<typeof meta>

const variants = ["none", "pulse", "shine"] as const

export const Shapes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--spaces-3)" }}>
      <Skeleton height={36} width={150} />
      <SkeletonCircle width={48} />
      <SkeletonText lineClamp={4} width={220} />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--spaces-3)" }}>
      {variants.map((variant) => (
        <Skeleton key={variant} variant={variant} width={180} />
      ))}
    </div>
  ),
}

function LoadingPreview() {
  const [loading, setLoading] = useState(true)
  return (
    <div
      style={{ display: "grid", gap: "var(--spaces-3)", justifyItems: "start" }}
    >
      <button type="button" onClick={() => setLoading(!loading)}>
        {loading ? "Show content" : "Show placeholder"}
      </button>
      <Skeleton fadeDuration="250ms" fitContent loading={loading}>
        <strong>Profile loaded</strong>
      </Skeleton>
    </div>
  )
}

export const Loaded: Story = { render: () => <LoadingPreview /> }
