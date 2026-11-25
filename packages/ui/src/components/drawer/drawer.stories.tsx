import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"
import { keys } from "#storybook"
import { Button } from "../button"
import { Text } from "../text"
import { useDrawerContext } from "./drawer"
import { drawerStyle } from "./drawer.style"
import { Drawer } from "./index"

const meta = {
  component: Drawer.Root,
  title: "Components / Drawer",
} satisfies Meta<typeof Drawer.Root>

export default meta

type Story = StoryObj<typeof meta>

function DrawerCloseAction({ label }: { label: string }) {
  const context = useDrawerContext()
  return (
    <Button variant="outline" onClick={() => context?.setOpen(false)}>
      {label}
    </Button>
  )
}

export const Basic: Story = {
  render: (args) => (
    <Drawer.Root {...args}>
      <Drawer.Trigger>
        <Button>Open Drawer</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.CloseButton />
        <Drawer.Header>
          <Drawer.Title>Workspace Filters</Drawer.Title>
          <Drawer.Description>
            Refine items without losing your current scroll position.
          </Drawer.Description>
        </Drawer.Header>
        <Drawer.Body>
          <Text>
            Adjust visibility rules, sorting options, and active tags.
          </Text>
        </Drawer.Body>
        <Drawer.Footer>
          <DrawerCloseAction label="Cancel" />
          <Button>Apply</Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  ),
}

export const Placement: Story = {
  render: () => {
    const [placement, setPlacement] = useState<
      keyof typeof drawerStyle.props.placement | null
    >(null)

    return (
      <>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          {keys(drawerStyle.props.placement).map((value) => (
            <Button
              key={value}
              variant="outline"
              onClick={() => setPlacement(value)}
            >
              {value}
            </Button>
          ))}
        </div>
        <Drawer.Root
          open={placement !== null}
          placement={placement ?? "end"}
          onOpenChange={(open) => {
            if (!open) setPlacement(null)
          }}
        >
          <Drawer.Content>
            <Drawer.CloseButton />
            <Drawer.Header>
              <Drawer.Title>Placement: {placement}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <Text>Drawers can slide from start, end, top, or bottom.</Text>
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant="outline" onClick={() => setPlacement(null)}>
                Close
              </Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Root>
      </>
    )
  },
}

export const Size: Story = {
  render: () => {
    const [activeSize, setActiveSize] = useState<
      keyof typeof drawerStyle.sizes | null
    >(null)

    return (
      <>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          {keys(drawerStyle.sizes).map((size) => (
            <Button
              key={size}
              variant="outline"
              onClick={() => setActiveSize(size)}
            >
              Size: {size}
            </Button>
          ))}
        </div>
        <Drawer.Root
          size={activeSize ?? "md"}
          open={activeSize !== null}
          onOpenChange={(open) => {
            if (!open) setActiveSize(null)
          }}
        >
          <Drawer.Content>
            <Drawer.CloseButton />
            <Drawer.Header>
              <Drawer.Title>Size: {activeSize}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <Text>
                Drawers support xs, sm, md, lg, xl, and full dimensions.
              </Text>
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant="outline" onClick={() => setActiveSize(null)}>
                Close
              </Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Root>
      </>
    )
  },
}

export const ScrollableBody: Story = {
  render: () => (
    <Drawer.Root>
      <Drawer.Trigger>
        <Button>Scrollable Drawer</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.CloseButton />
        <Drawer.Header>
          <Drawer.Title>Activity Log</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          {Array.from({ length: 24 }, (_, index) => (
            <Text key={index}>
              Event {index + 1}: Drawer body content scrolls independently while
              header and footer stay fixed.
            </Text>
          ))}
        </Drawer.Body>
        <Drawer.Footer>
          <DrawerCloseAction label="Close" />
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Controlled Drawer</Button>
        <Drawer.Root open={open} onOpenChange={setOpen}>
          <Drawer.Content>
            <Drawer.CloseButton />
            <Drawer.Header>
              <Drawer.Title>Controlled Drawer</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <Text>State managed by the parent component.</Text>
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Done
              </Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Root>
      </>
    )
  },
}
