import type { Meta, StoryObj } from "@storybook/react-vite"
import { CircleProgress } from "./index"
const meta = {
  component: CircleProgress.Root,
  title: "Components/CircleProgress",
} satisfies Meta<typeof CircleProgress.Root>

export default meta

type Story = StoryObj<typeof meta>

const sizes = ["xs", "sm", "md", "lg", "xl"] as const

export const Sizes: Story = {
  render: () => (
    <div
      style={{ alignItems: "center", display: "flex", gap: "var(--spaces-3)" }}
    >
      {sizes.map((size) => (
        <CircleProgress.Root
          key={size}
          size={size}
          aria-label={`Upload, ${size}`}
          value={60}
        />
      ))}
    </div>
  ),
}

export const WithLabel: Story = {
  args: {
    size: "xl",
    variant: "subtle",
    children: <CircleProgress.Label>65%</CircleProgress.Label>,
    shape: "square",
    value: 65,
  },
}

export const Indeterminate: Story = {
  args: { size: "xl", value: null },
}

export const CustomGeometry: Story = {
  args: {
    boxSize: "100px",
    rangeColor: "success.solid",
    thickness: 3,
    trackColor: "success.muted",
    value: 65,
  },
}
