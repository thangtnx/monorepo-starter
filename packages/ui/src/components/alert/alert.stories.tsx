import type { Meta, StoryObj } from "@storybook/react-vite"
import { colorSchemes, keys, PropsTable } from "#storybook"
import {
  Check,
  CircleAlert,
  Info,
  LoaderCircle,
  Icon as SvgIcon,
  TriangleAlert,
  X,
} from "../icon"
import { alertStyle } from "./alert.style"
import { Alert } from "./index"
const meta = {
  component: Alert.Root,
  title: "Components / Alert",
} satisfies Meta<typeof Alert.Root>

export default meta

type Story = StoryObj<typeof meta>

const variants = keys(alertStyle.variants)
const statuses = [
  "info",
  "success",
  "warning",
  "error",
  "danger",
  "loading",
] as const

export const Basic: Story = {
  render: (args) => (
    <Alert.Root {...args}>
      <Alert.Title>Workspace sync</Alert.Title>
      <Alert.Description>Check your sync settings.</Alert.Description>
    </Alert.Root>
  ),
}

export const Variant: Story = {
  render: (args) => (
    <PropsTable columns={variants} rows={colorSchemes}>
      {(row, column) => (
        <Alert.Root {...args} colorScheme={row} variant={column}>
          <Alert.Title>Workspace sync</Alert.Title>
        </Alert.Root>
      )}
    </PropsTable>
  ),
}

export const ColorScheme: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={colorSchemes}>
      {(row) => (
        <Alert.Root {...args} colorScheme={row} variant="subtle">
          <Alert.Title>Workspace sync</Alert.Title>
        </Alert.Root>
      )}
    </PropsTable>
  ),
}

export const Icon: Story = {
  render: () => (
    <Alert.Root variant="surface" status="info">
      <Alert.Icon as={Info} />
      <Alert.Title>Information</Alert.Title>
      <Alert.Description>Check your sync settings.</Alert.Description>
    </Alert.Root>
  ),
}

export const StatusIcons: Story = {
  render: () => {
    const statusIcons = {
      danger: <SvgIcon as={CircleAlert} aria-label="Danger" />,
      error: <SvgIcon as={X} aria-label="Error" />,
      info: <SvgIcon as={Info} aria-label="Information" />,
      loading: <SvgIcon as={LoaderCircle} aria-label="Loading" />,
      success: <SvgIcon as={Check} aria-label="Success" />,
      warning: <SvgIcon as={TriangleAlert} aria-label="Warning" />,
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

export const Loading: Story = {
  render: () => (
    <Alert.Root variant="island" aria-busy="true">
      <Alert.Loading loadingScheme="dots" />
      <Alert.Title>Checking for updates</Alert.Title>
    </Alert.Root>
  ),
}

export const Status: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={statuses}>
      {(row) => (
        <Alert.Root {...args} status={row}>
          <Alert.Title>Workspace sync</Alert.Title>
        </Alert.Root>
      )}
    </PropsTable>
  ),
}
