import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"
import { keys } from "#storybook"
import { Button } from "../button"
import { Text } from "../text"
import { useDialogContext } from "./dialog"
import { dialogStyle } from "./dialog.style"
import { Dialog } from "./index"

const meta = {
  component: Dialog.Root,
  title: "Components / Dialog",
} satisfies Meta<typeof Dialog.Root>

export default meta

type Story = StoryObj<typeof meta>

function DialogCloseAction({
  variant = "outline",
  label,
}: {
  label: string
  variant?: "outline" | "solid"
}) {
  const context = useDialogContext()
  return (
    <Button variant={variant} onClick={() => context?.setOpen(false)}>
      {label}
    </Button>
  )
}

export const Basic: Story = {
  render: (args) => (
    <Dialog.Root {...args}>
      <Dialog.Trigger>
        <Button>Open Dialog</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.CloseButton />
        <Dialog.Header>
          <Dialog.Title>Confirm Action</Dialog.Title>
          <Dialog.Description>
            Review the details below before saving your changes.
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <Text>
            Your workspace settings will take effect immediately for all active
            sessions.
          </Text>
        </Dialog.Body>
        <Dialog.Footer>
          <DialogCloseAction label="Cancel" />
          <DialogCloseAction variant="solid" label="Save Changes" />
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  ),
}

export const Size: Story = {
  render: () => {
    const [activeSize, setActiveSize] = useState<
      keyof typeof dialogStyle.sizes | null
    >(null)

    return (
      <>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          {keys(dialogStyle.sizes).map((size) => (
            <Button
              key={size}
              variant="outline"
              onClick={() => setActiveSize(size)}
            >
              Open {size}
            </Button>
          ))}
        </div>
        <Dialog.Root
          size={activeSize ?? "md"}
          open={activeSize !== null}
          onOpenChange={(open) => {
            if (!open) setActiveSize(null)
          }}
        >
          <Dialog.Content>
            <Dialog.CloseButton />
            <Dialog.Header>
              <Dialog.Title>Size: {activeSize}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text>
                Dialogs support sm, md, lg, xl, and full viewport sizing.
              </Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" onClick={() => setActiveSize(null)}>
                Close
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
      </>
    )
  },
}

export const Placement: Story = {
  render: () => {
    const [placement, setPlacement] = useState<
      keyof typeof dialogStyle.props.placement | null
    >(null)

    return (
      <>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          {keys(dialogStyle.props.placement).map((value) => (
            <Button
              key={value}
              variant="outline"
              onClick={() => setPlacement(value)}
            >
              Placement: {value}
            </Button>
          ))}
        </div>
        <Dialog.Root
          open={placement !== null}
          placement={placement ?? "center"}
          onOpenChange={(open) => {
            if (!open) setPlacement(null)
          }}
        >
          <Dialog.Content>
            <Dialog.CloseButton />
            <Dialog.Header>
              <Dialog.Title>Placement: {placement}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text>
                Dialogs can be centered or anchored near the top edge.
              </Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" onClick={() => setPlacement(null)}>
                Close
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
      </>
    )
  },
}

export const ScrollBehavior: Story = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>Scrollable Dialog</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.CloseButton />
        <Dialog.Header>
          <Dialog.Title>Terms of Service</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          {Array.from({ length: 18 }, (_, index) => (
            <Text key={index}>
              Section {index + 1}: Long dialog content scrolls cleanly within
              the dialog body while the header and footer stay pinned.
            </Text>
          ))}
        </Dialog.Body>
        <Dialog.Footer>
          <Button>Acknowledge</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  ),
}

export const CustomClose: Story = {
  render: () => (
    <Dialog.Root closeOnEsc={false} closeOnOverlayClick={false}>
      <Dialog.Trigger>
        <Button>Explicit Close Only</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.CloseButton aria-label="Dismiss dialog" />
        <Dialog.Header>
          <Dialog.Title>Required Action</Dialog.Title>
          <Dialog.Description>
            Backdrop click and Escape key are disabled for this dialog.
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <Text>Use the close button in the top-right corner to dismiss.</Text>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Controlled Dialog</Button>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Content>
            <Dialog.CloseButton />
            <Dialog.Header>
              <Dialog.Title>Controlled State</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text>Managed through external React state.</Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Done
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
      </>
    )
  },
}
