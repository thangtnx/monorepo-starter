import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"
import { Button } from "../button"
import { ChevronDown, Icon } from "../icon"
import { Menu } from "./index"

const meta = {
  component: Menu.Root,
  title: "Components / Menu",
} satisfies Meta<typeof Menu.Root>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: (args) => (
    <Menu.Root {...args}>
      <Menu.Trigger>
        <Button endIcon={<Icon as={ChevronDown} />}>Actions</Button>
      </Menu.Trigger>
      <Menu.Content>
        <Menu.Item>New File</Menu.Item>
        <Menu.Item>Duplicate</Menu.Item>
        <Menu.Item disabled>Archive</Menu.Item>
        <Menu.Separator />
        <Menu.Item>Delete</Menu.Item>
      </Menu.Content>
    </Menu.Root>
  ),
}

export const WithCommands: Story = {
  render: () => (
    <Menu.Root>
      <Menu.Trigger>
        <Button variant="outline">Edit</Button>
      </Menu.Trigger>
      <Menu.Content>
        <Menu.Item command="⌘X">Cut</Menu.Item>
        <Menu.Item command="⌘C">Copy</Menu.Item>
        <Menu.Item command="⌘V">Paste</Menu.Item>
      </Menu.Content>
    </Menu.Root>
  ),
}

export const GroupsAndSeparator: Story = {
  render: () => (
    <Menu.Root>
      <Menu.Trigger>
        <Button variant="outline">Workspace</Button>
      </Menu.Trigger>
      <Menu.Content>
        <Menu.Group>
          <Menu.Label>Account</Menu.Label>
          <Menu.Item>Profile</Menu.Item>
          <Menu.Item>Billing</Menu.Item>
        </Menu.Group>
        <Menu.Separator />
        <Menu.Group>
          <Menu.Label>Session</Menu.Label>
          <Menu.Item>Sign out</Menu.Item>
        </Menu.Group>
      </Menu.Content>
    </Menu.Root>
  ),
}

export const CheckboxAndRadio: Story = {
  render: () => {
    const [showGrid, setShowGrid] = useState(true)
    const [sortBy, setSortBy] = useState("updated")

    return (
      <Menu.Root closeOnSelect={false}>
        <Menu.Trigger>
          <Button variant="outline">View Options</Button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Label>Display</Menu.Label>
          <Menu.CheckboxItem checked={showGrid} onCheckedChange={setShowGrid}>
            Show grid lines
          </Menu.CheckboxItem>
          <Menu.Separator />
          <Menu.Label>Sort order</Menu.Label>
          <Menu.RadioGroup value={sortBy} onValueChange={setSortBy}>
            <Menu.RadioItem value="updated">Last updated</Menu.RadioItem>
            <Menu.RadioItem value="name">Name</Menu.RadioItem>
            <Menu.RadioItem value="size">File size</Menu.RadioItem>
          </Menu.RadioGroup>
        </Menu.Content>
      </Menu.Root>
    )
  },
}

export const Placement: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
      {(["bottom-start", "bottom-end", "top-start", "right"] as const).map(
        (placement) => (
          <Menu.Root key={placement} placement={placement}>
            <Menu.Trigger>
              <Button variant="outline">{placement}</Button>
            </Menu.Trigger>
            <Menu.Content>
              <Menu.Item>Open</Menu.Item>
              <Menu.Item>Rename</Menu.Item>
              <Menu.Item>Share</Menu.Item>
            </Menu.Content>
          </Menu.Root>
        ),
      )}
    </div>
  ),
}
