import type { Meta, StoryObj } from "@storybook/react-vite"
import { colorSchemes, keys, PropsTable } from "#storybook"
import { Badge } from "./badge"
import { badgeStyle } from "./badge.style"

const meta = {
  args: { children: "Draft" },
  component: Badge,
  title: "Components / Badge",
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const Variant: Story = {
  render: (args) => (
    <PropsTable columns={keys(badgeStyle.variants)} rows={colorSchemes}>
      {(row, column) => (
        <Badge {...args} colorScheme={row} variant={column}>
          {column}
        </Badge>
      )}
    </PropsTable>
  ),
}

export const Size: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={keys(badgeStyle.sizes)}>
      {(row) => (
        <Badge {...args} size={row}>
          {row}
        </Badge>
      )}
    </PropsTable>
  ),
}

export const ColorScheme: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={colorSchemes}>
      {(row) => (
        <Badge {...args} colorScheme={row}>
          {row}
        </Badge>
      )}
    </PropsTable>
  ),
}
