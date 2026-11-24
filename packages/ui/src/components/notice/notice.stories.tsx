import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"
import { Notice } from "./index"
const meta = {
  component: Notice.Item,
  title: "Components/Notice",
} satisfies Meta<typeof Notice.Item>

export default meta

type Story = StoryObj<typeof meta>

const variants = ["island", "plain", "solid", "subtle", "surface"] as const
const statuses = ["info", "success", "warning", "error", "danger"] as const

export const Variants: Story = {
  render: () => (
    <Notice.Root style={{ display: "grid", gap: "var(--spaces-3)" }}>
      {variants.map((variant, index) => (
        <Notice.Item
          key={variant}
          variant={variant}
          description="Your changes are available."
          status={statuses[index]}
          title={variant}
        />
      ))}
    </Notice.Root>
  ),
}

function DismissibleNotice({ strategy }: { strategy: "button" | "click" }) {
  const [open, setOpen] = useState(true)
  return open ? (
    <Notice.Item
      closable
      closeStrategies={[strategy]}
      description="Changes apply to this workspace."
      status="success"
      title="Preferences saved"
      onClose={() => setOpen(false)}
    />
  ) : (
    <button type="button" onClick={() => setOpen(true)}>
      Show notice
    </button>
  )
}

export const Dismissible: Story = {
  render: () => <DismissibleNotice strategy="button" />,
}

export const ClickToDismiss: Story = {
  render: () => <DismissibleNotice strategy="click" />,
}

export const Loading: Story = {
  args: {
    description: "The export will be ready shortly.",
    status: "loading",
    title: "Exporting files",
  },
}

export const CustomLoading: Story = {
  args: {
    description: "The export will be ready shortly.",
    loadingScheme: "rings",
    title: "Exporting files",
  },
}
