import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "../button"
import { EmptyState } from "./index"
const meta = {
  component: EmptyState.Root,
  title: "Components/EmptyState",
} satisfies Meta<typeof EmptyState.Root>

export default meta

type Story = StoryObj<typeof meta>

const sizes = ["sm", "md", "lg"] as const

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--spaces-3)" }}>
      {sizes.map((size) => (
        <EmptyState.Root
          key={size}
          size={size}
          actions={<Button>Add document</Button>}
          description="Documents you add will appear here."
          title="No documents"
        />
      ))}
    </div>
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
