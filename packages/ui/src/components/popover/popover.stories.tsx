import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"
import { keys } from "#storybook"
import { Button } from "../button"
import { Text } from "../text"
import { Popover } from "./index"
import { popoverStyle } from "./popover.style"

const meta = {
  component: Popover.Root,
  title: "Components / Popover",
} satisfies Meta<typeof Popover.Root>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: (args) => (
    <Popover.Root {...args}>
      <Popover.Trigger>
        <Button>Open Popover</Button>
      </Popover.Trigger>
      <Popover.Content aria-label="Project details">
        <Popover.CloseButton />
        <Popover.Header>Project details</Popover.Header>
        <Popover.Body>
          <Text>
            Review storage consumption and collaborator access for this
            workspace.
          </Text>
        </Popover.Body>
        <Popover.Footer>
          <Button size="sm" variant="outline">
            Manage
          </Button>
        </Popover.Footer>
      </Popover.Content>
    </Popover.Root>
  ),
}

export const Placement: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
      {(["top", "bottom", "left", "right"] as const).map((placement) => (
        <Popover.Root key={placement} placement={placement}>
          <Popover.Trigger>
            <Button variant="outline">{placement}</Button>
          </Popover.Trigger>
          <Popover.Content aria-label={`Popover placed ${placement}`}>
            <Popover.CloseButton />
            <Popover.Header>Placement: {placement}</Popover.Header>
            <Popover.Body>
              Flips automatically near viewport edges.
            </Popover.Body>
          </Popover.Content>
        </Popover.Root>
      ))}
    </div>
  ),
}

export const Size: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
      {keys(popoverStyle.sizes).map((size) => (
        <Popover.Root key={size} size={size}>
          <Popover.Trigger>
            <Button variant="outline">Size: {size}</Button>
          </Popover.Trigger>
          <Popover.Content aria-label={`Popover size ${size}`}>
            <Popover.CloseButton />
            <Popover.Header>Size: {size}</Popover.Header>
            <Popover.Body>Compact, default, and expanded widths.</Popover.Body>
          </Popover.Content>
        </Popover.Root>
      ))}
    </div>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger>
          <Button>Controlled Popover</Button>
        </Popover.Trigger>
        <Popover.Content aria-label="Controlled popover">
          <Popover.Header>Controlled State</Popover.Header>
          <Popover.Body>
            Open state is synchronized with the parent component.
          </Popover.Body>
          <Popover.Footer>
            <Button size="sm" variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </Popover.Footer>
        </Popover.Content>
      </Popover.Root>
    )
  },
}
