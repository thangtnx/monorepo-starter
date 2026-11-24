import type { Meta, StoryObj } from "@storybook/react-vite"
import { colorSchemes, PropsTable } from "#storybook"
import { Progress } from "./progress"
const meta = {
  args: { "aria-label": "Upload progress", value: 65 },
  component: Progress,
  title: "Components / Progress",
} satisfies Meta<typeof Progress>

export default meta

type Story = StoryObj<typeof meta>

const sizes = ["xs", "sm", "md", "lg", "xl"] as const
const shapes = ["circle", "rounded", "square"] as const

export const Basic: Story = {}

export const Variant: Story = {
  render: (args) => (
    <PropsTable columns={["outline", "subtle"] as const} rows={colorSchemes}>
      {(row, column) => (
        <Progress {...args} colorScheme={row} variant={column} />
      )}
    </PropsTable>
  ),
}

export const Size: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={sizes}>
      {(row) => <Progress {...args} size={row} />}
    </PropsTable>
  ),
}

export const ColorScheme: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={colorSchemes}>
      {(row) => <Progress {...args} colorScheme={row} />}
    </PropsTable>
  ),
}

export const Shape: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={shapes}>
      {(row) => <Progress {...args} shape={row} />}
    </PropsTable>
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
