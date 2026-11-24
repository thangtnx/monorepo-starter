import type { Meta, StoryObj } from "@storybook/react-vite"
import { Progress } from "./progress"
const meta = {
  component: Progress,
  title: "Components/Progress",
} satisfies Meta<typeof Progress>

export default meta

type Story = StoryObj<typeof meta>

const sizes = ["xs", "sm", "md", "lg", "xl"] as const
const shapes = ["circle", "rounded", "square"] as const

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--spaces-3)" }}>
      {sizes.map((size) => (
        <Progress
          key={size}
          size={size}
          aria-label={`Upload, ${size}`}
          value={65}
        />
      ))}
    </div>
  ),
}

export const ShapesAndVariants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--spaces-3)" }}>
      {shapes.map((shape) => (
        <Progress
          key={shape}
          variant="subtle"
          aria-label={`Upload, ${shape}`}
          shape={shape}
          value={65}
        />
      ))}
    </div>
  ),
}

export const Striped: Story = {
  args: { colorScheme: "success", striped: true, value: 70 },
}

export const Animated: Story = {
  args: { animated: true, duration: 2, value: 70 },
}

export const Indeterminate: Story = { args: { value: null } }

export const CustomColors: Story = {
  args: { rangeColor: "success.solid", trackColor: "success.muted", value: 50 },
}
