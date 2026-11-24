import type { Meta, StoryObj } from "@storybook/react-vite"
import { Alert } from "./index"
const meta = {
  component: Alert.Root,
  title: "Components/Alert",
} satisfies Meta<typeof Alert.Root>

export default meta

type Story = StoryObj<typeof meta>

const variants = ["island", "plain", "solid", "subtle", "surface"] as const
const statuses = ["info", "success", "warning", "error", "danger"] as const

export const VariantsAndStatuses: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--spaces-3)" }}>
      {variants.map((variant) => (
        <section
          key={variant}
          style={{ display: "grid", gap: "var(--spaces-2)" }}
        >
          <h3>{variant}</h3>
          {statuses.map((status) => (
            <Alert.Root key={status} variant={variant} status={status}>
              <Alert.Title>{status}</Alert.Title>
              <Alert.Description>Check your sync settings.</Alert.Description>
            </Alert.Root>
          ))}
        </section>
      ))}
    </div>
  ),
}

export const Icon: Story = {
  render: () => (
    <Alert.Root variant="surface" status="info">
      <Alert.Icon>
        <span>Info</span>
      </Alert.Icon>
      <Alert.Title>Information</Alert.Title>
      <Alert.Description>Check your sync settings.</Alert.Description>
    </Alert.Root>
  ),
}

export const StatusIcons: Story = {
  render: () => {
    const statusIcons = {
      danger: <span>!!</span>,
      error: <span>×</span>,
      info: <span>i</span>,
      success: <span>✓</span>,
      warning: <span>!</span>,
    }

    return (
      <div style={{ display: "grid", gap: "var(--spaces-2)" }}>
        {statuses.map((status) => (
          <Alert.Root
            key={status}
            variant="surface"
            status={status}
            statusIcons={statusIcons}
          >
            <Alert.Title>{status}</Alert.Title>
          </Alert.Root>
        ))}
      </div>
    )
  },
}

export const Pending: Story = {
  render: () => (
    <Alert.Root variant="island" aria-busy="true">
      <Alert.Loading loadingScheme="dots" />
      <Alert.Title>Checking for updates</Alert.Title>
    </Alert.Root>
  ),
}
