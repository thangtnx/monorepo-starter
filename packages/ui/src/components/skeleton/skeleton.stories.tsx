import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"
import { PropsTable } from "#storybook"
import { Skeleton, SkeletonCircle, SkeletonText } from "./index"
const meta = {
  component: Skeleton,
  title: "Components / Skeleton",
} satisfies Meta<typeof Skeleton>

export default meta

type Story = StoryObj<typeof meta>

const variants = ["none", "pulse", "shine"] as const

export const Basic: Story = { args: { height: 36, width: 180 } }

export const Variant: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={variants}>
      {(row) => <Skeleton {...args} variant={row} width={180} />}
    </PropsTable>
  ),
}

export const Shapes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--spaces-3)" }}>
      <Skeleton height={36} width={150} />
      <SkeletonCircle width={48} />
      <SkeletonText lineClamp={4} width={220} />
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
