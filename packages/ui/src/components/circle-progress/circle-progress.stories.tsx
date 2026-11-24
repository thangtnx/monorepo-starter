import type { Meta, StoryObj } from "@storybook/react-vite"
import { colorSchemes, PropsTable } from "#storybook"
import { CircleProgress } from "./index"
const meta = {
  args: { "aria-label": "Upload progress", value: 60 },
  component: CircleProgress.Root,
  title: "Components / CircleProgress",
} satisfies Meta<typeof CircleProgress.Root>

export default meta

type Story = StoryObj<typeof meta>

const sizes = ["xs", "sm", "md", "lg", "xl"] as const

export const Basic: Story = {}

export const Variant: Story = {
  render: (args) => (
    <PropsTable columns={["outline", "subtle"] as const} rows={colorSchemes}>
      {(row, column) => (
        <CircleProgress.Root {...args} colorScheme={row} variant={column} />
      )}
    </PropsTable>
  ),
}

export const Size: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={sizes}>
      {(row) => <CircleProgress.Root {...args} size={row} />}
    </PropsTable>
  ),
}

export const ColorScheme: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={colorSchemes}>
      {(row) => <CircleProgress.Root {...args} colorScheme={row} />}
    </PropsTable>
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

export const Shape: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={["rounded", "square"] as const}>
      {(row) => <CircleProgress.Root {...args} shape={row} />}
    </PropsTable>
  ),
}
