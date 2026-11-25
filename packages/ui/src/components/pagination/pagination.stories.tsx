import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"
import { colorSchemes, keys, PropsTable } from "#storybook"
import { Pagination } from "./pagination"
import { paginationStyle } from "./pagination.style"

const meta = {
  args: { defaultPage: 1, total: 10 },
  component: Pagination,
  title: "Components / Pagination",
} satisfies Meta<typeof Pagination>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const Variant: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={keys(paginationStyle.variants)}>
      {(row) => (
        <Pagination
          {...args}
          variant={row}
          aria-label={`Pagination (${row})`}
        />
      )}
    </PropsTable>
  ),
}

export const Size: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={keys(paginationStyle.sizes)}>
      {(row) => (
        <Pagination {...args} size={row} aria-label={`Pagination (${row})`} />
      )}
    </PropsTable>
  ),
}

export const ColorScheme: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={colorSchemes}>
      {(row) => (
        <Pagination
          {...args}
          colorScheme={row}
          aria-label={`Pagination (${row})`}
        />
      )}
    </PropsTable>
  ),
}

export const Edges: Story = {
  args: { defaultPage: 5, total: 10, withEdges: true },
}

export const Siblings: Story = {
  args: { defaultPage: 6, siblings: 2, total: 15 },
}

export const Boundaries: Story = {
  args: { boundaries: 2, defaultPage: 8, total: 16 },
}

export const Controlled: Story = {
  render: function ControlledPagination() {
    const [page, setPage] = useState(3)
    return <Pagination page={page} total={10} onChange={setPage} />
  },
}

export const Disabled: Story = {
  args: { defaultPage: 4, disabled: true, total: 10 },
}
