import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"
import { colorSchemes, PropsTable } from "#storybook"
import { Notice } from "./index"
const meta = {
  args: { title: "Preferences saved" },
  component: Notice.Item,
  title: "Components / Notice",
} satisfies Meta<typeof Notice.Item>

export default meta

type Story = StoryObj<typeof meta>

const variants = ["island", "plain", "solid", "subtle", "surface"] as const
const statuses = ["info", "success", "warning", "error", "danger"] as const

export const Basic: Story = {
  args: { description: "Changes apply to this workspace.", status: "success" },
}

export const Variant: Story = {
  render: (args) => (
    <PropsTable columns={variants} rows={colorSchemes}>
      {(row, column) => (
        <Notice.Item {...args} colorScheme={row} variant={column} />
      )}
    </PropsTable>
  ),
}

export const ColorScheme: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={colorSchemes}>
      {(row) => <Notice.Item {...args} colorScheme={row} variant="subtle" />}
    </PropsTable>
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

export const Status: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={statuses}>
      {(row) => <Notice.Item {...args} status={row} />}
    </PropsTable>
  ),
}
