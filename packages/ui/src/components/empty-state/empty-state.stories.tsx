import type { Meta, StoryObj } from "@storybook/react-vite"
import { PropsTable } from "#storybook"
import { Button } from "../button"
import { EmptyState } from "./index"
const meta = {
  args: {
    actions: <Button>Add document</Button>,
    description: "Documents you add will appear here.",
    title: "No documents",
  },
  component: EmptyState.Root,
  title: "Components / EmptyState",
} satisfies Meta<typeof EmptyState.Root>

export default meta

type Story = StoryObj<typeof meta>

const sizes = ["sm", "md", "lg"] as const

export const Basic: Story = {}

export const Size: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={sizes}>
      {(row) => <EmptyState.Root {...args} size={row} />}
    </PropsTable>
  ),
}

export const CustomContent: Story = {
  render: () => (
    <EmptyState.Root>
      <EmptyState.Indicator>
        <strong>0</strong>
      </EmptyState.Indicator>
      <EmptyState.Content>
        <EmptyState.Title>No saved searches</EmptyState.Title>
        <EmptyState.Description>
          Save a search to revisit its results.
        </EmptyState.Description>
      </EmptyState.Content>
      <EmptyState.Actions>
        <Button variant="outline">Browse results</Button>
      </EmptyState.Actions>
    </EmptyState.Root>
  ),
}
