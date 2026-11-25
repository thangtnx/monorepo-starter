import type { Meta, StoryObj } from "@storybook/react-vite"
import type { TableRootProps } from "./table"
import { colorSchemes, keys, PropsTable } from "#storybook"
import { Table } from "./index"
import { tableStyle } from "./table.style"

const rows = [
  { id: "INV-001", amount: "$120.00", member: "Alex", status: "Paid" },
  { id: "INV-002", amount: "$85.00", member: "Blair", status: "Pending" },
  { id: "INV-003", amount: "$240.00", member: "Casey", status: "Paid" },
  { id: "INV-004", amount: "$64.00", member: "Devon", status: "Draft" },
]

function SampleTable(props: TableRootProps) {
  return (
    <Table.ScrollArea>
      <Table.Root {...props}>
        <Table.Caption>Recent workspace invoices</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.Head>Invoice</Table.Head>
            <Table.Head>Member</Table.Head>
            <Table.Head>Status</Table.Head>
            <Table.Head numeric>Amount</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell>{item.id}</Table.Cell>
              <Table.Cell>{item.member}</Table.Cell>
              <Table.Cell>{item.status}</Table.Cell>
              <Table.Cell numeric>{item.amount}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.Cell colSpan={3}>Total</Table.Cell>
            <Table.Cell numeric>$509.00</Table.Cell>
          </Table.Row>
        </Table.Footer>
      </Table.Root>
    </Table.ScrollArea>
  )
}

const meta = {
  component: Table.Root,
  title: "Components / Table",
} satisfies Meta<typeof Table.Root>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: (args) => <SampleTable {...args} />,
}

export const Variant: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={keys(tableStyle.variants)}>
      {(row) => <SampleTable {...args} variant={row} />}
    </PropsTable>
  ),
}

export const Size: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={keys(tableStyle.sizes)}>
      {(row) => <SampleTable {...args} size={row} />}
    </PropsTable>
  ),
}

export const Striped: Story = {
  args: { striped: true },
  render: (args) => <SampleTable {...args} />,
}

export const HighlightOnHover: Story = {
  args: { highlightOnHover: true },
  render: (args) => <SampleTable {...args} />,
}

export const WithBorder: Story = {
  args: { withBorder: true },
  render: (args) => <SampleTable {...args} />,
}

export const WithColumnBorders: Story = {
  args: { withBorder: true, withColumnBorders: true },
  render: (args) => <SampleTable {...args} />,
}

export const StickyHeader: Story = {
  args: { stickyHeader: true },
  render: (args) => (
    <Table.ScrollArea
      style={{ maxHeight: "12rem" }}
      aria-label="Recent workspace invoices"
      role="region"
      tabIndex={0}
    >
      <Table.Root {...args}>
        <Table.Header>
          <Table.Row>
            <Table.Head>Invoice</Table.Head>
            <Table.Head>Member</Table.Head>
            <Table.Head numeric>Amount</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Array.from({ length: 8 }, (_, index) => (
            <Table.Row key={index}>
              <Table.Cell>{`INV-00${index + 1}`}</Table.Cell>
              <Table.Cell>{rows[index % rows.length]?.member}</Table.Cell>
              <Table.Cell numeric>
                {rows[index % rows.length]?.amount}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  ),
}

export const ColorScheme: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={colorSchemes}>
      {(row) => <SampleTable {...args} colorScheme={row} striped />}
    </PropsTable>
  ),
}
