import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"
import { Button } from "../button"
import { Tooltip } from "./index"

const meta = {
  component: Tooltip,
  title: "Components / Tooltip",
} satisfies Meta<typeof Tooltip>

export default meta

type Story = StoryObj

export const Basic: Story = {
  render: (args) => (
    <Tooltip label="Helpful contextual tip" {...args}>
      <Button>Hover or focus me</Button>
    </Tooltip>
  ),
}

export const Placement: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
      {(["top", "bottom", "left", "right"] as const).map((placement) => (
        <Tooltip
          key={placement}
          label={`Placement: ${placement}`}
          placement={placement}
        >
          <Button variant="outline">{placement}</Button>
        </Tooltip>
      ))}
    </div>
  ),
}

export const Delay: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "0.75rem" }}>
      <Tooltip label="Instant tooltip" openDelay={0}>
        <Button variant="outline">No delay</Button>
      </Tooltip>
      <Tooltip closeDelay={200} label="Delayed open and close" openDelay={400}>
        <Button variant="outline">400ms delay</Button>
      </Tooltip>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Tooltip disabled label="Should not appear">
      <Button variant="outline">Disabled tooltip</Button>
    </Tooltip>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <Tooltip label="Controlled tooltip" open={open} onOpenChange={setOpen}>
          <Button variant="outline">Target</Button>
        </Tooltip>
        <Button onClick={() => setOpen((prev) => !prev)}>
          {open ? "Hide" : "Show"}
        </Button>
      </div>
    )
  },
}
