import type { Meta, StoryObj } from "@storybook/react-vite"
import type { TabsRootProps } from "./tabs"
import { useState } from "react"
import { colorSchemes, keys, PropsTable } from "#storybook"
import { Tabs } from "."
import { Stack } from "../stack"
import { Text } from "../text"
import { tabsStyle } from "./tabs.style"

function SampleTabs(props: TabsRootProps) {
  return (
    <Tabs.Root defaultValue="account" {...props}>
      <Tabs.List aria-label="Account sections">
        <Tabs.Tab value="account">Account</Tabs.Tab>
        <Tabs.Tab value="security">Security</Tabs.Tab>
        <Tabs.Tab value="billing">Billing</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panels>
        <Tabs.Panel value="account">
          Manage your profile and contact preferences.
        </Tabs.Panel>
        <Tabs.Panel value="security">
          Review active sessions and two-factor keys.
        </Tabs.Panel>
        <Tabs.Panel value="billing">
          Inspect invoices and saved payment methods.
        </Tabs.Panel>
      </Tabs.Panels>
    </Tabs.Root>
  )
}

const meta = {
  component: Tabs.Root,
  title: "Components / Tabs",
} satisfies Meta<typeof Tabs.Root>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: (args) => <SampleTabs {...args} />,
}

export const Variant: Story = {
  render: (args) => (
    <PropsTable columns={colorSchemes} rows={keys(tabsStyle.variants)}>
      {(row, column) => (
        <SampleTabs {...args} colorScheme={column} variant={row} />
      )}
    </PropsTable>
  ),
}

export const Size: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={keys(tabsStyle.sizes)}>
      {(row) => <SampleTabs {...args} size={row} />}
    </PropsTable>
  ),
}

export const ColorScheme: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={colorSchemes}>
      {(row) => <SampleTabs {...args} colorScheme={row} variant="subtle" />}
    </PropsTable>
  ),
}

export const Orientation: Story = {
  args: { orientation: "vertical" },
  render: (args) => <SampleTabs {...args} />,
}

export const Fitted: Story = {
  args: { fitted: true },
  render: (args) => <SampleTabs {...args} />,
}

export const Align: Story = {
  render: (args) => (
    <Stack gap="6">
      <SampleTabs {...args} align="start" />
      <SampleTabs {...args} align="center" />
      <SampleTabs {...args} align="end" />
    </Stack>
  ),
}

export const Disabled: Story = {
  render: (args) => (
    <Tabs.Root defaultValue="account" {...args}>
      <Tabs.List aria-label="Account sections">
        <Tabs.Tab value="account">Account</Tabs.Tab>
        <Tabs.Tab disabled value="security">
          Security
        </Tabs.Tab>
        <Tabs.Tab value="billing">Billing</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panels>
        <Tabs.Panel value="account">
          Manage your profile and contact preferences.
        </Tabs.Panel>
        <Tabs.Panel value="security">
          Review active sessions and two-factor keys.
        </Tabs.Panel>
        <Tabs.Panel value="billing">
          Inspect invoices and saved payment methods.
        </Tabs.Panel>
      </Tabs.Panels>
    </Tabs.Root>
  ),
}

export const Manual: Story = {
  args: { manual: true },
  render: (args) => <SampleTabs {...args} />,
}

export const Controlled: Story = {
  render: function ControlledTabs(args) {
    const [value, setValue] = useState("account")

    return (
      <Stack gap="3">
        <Text>Active tab: {value}</Text>
        <SampleTabs {...args} value={value} onValueChange={setValue} />
      </Stack>
    )
  },
}
