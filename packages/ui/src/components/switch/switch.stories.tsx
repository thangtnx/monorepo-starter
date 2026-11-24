import type { Meta, StoryObj } from "@storybook/react-vite"
import { colorSchemes, keys, PropsTable } from "#storybook"
import { Field } from "../field/field"
import { Switch } from "./switch"
import { switchStyle } from "./switch.style"

const meta = {
  args: { "aria-label": "Notifications" },
  component: Switch,
  title: "Components / Switch",
} satisfies Meta<typeof Switch>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const Variant: Story = {
  render: (args) => (
    <PropsTable columns={keys(switchStyle.variants)} rows={colorSchemes}>
      {(row, column) => (
        <Switch {...args} colorScheme={row} variant={column} defaultChecked />
      )}
    </PropsTable>
  ),
}

export const Size: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={keys(switchStyle.sizes)}>
      {(row) => <Switch {...args} size={row} aria-label={row} defaultChecked />}
    </PropsTable>
  ),
}

export const ColorScheme: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={colorSchemes}>
      {(row) => (
        <Switch {...args} colorScheme={row} aria-label={row} defaultChecked />
      )}
    </PropsTable>
  ),
}

export const Checked: Story = { args: { defaultChecked: true } }

export const Parts: Story = {
  args: {
    "aria-label": undefined,
    children: "Notifications",
    icon: { off: "−", on: "✓" },
    inputProps: { name: "notifications" },
    labelProps: { title: "Notifications" },
    thumbProps: { title: "Toggle" },
    trackProps: { title: "Notification state" },
  },
}

export const Disabled: Story = {
  args: { defaultChecked: true, disabled: true },
}

export const ReadOnly: Story = {
  args: { defaultChecked: true, readOnly: true },
}

export const Invalid: Story = {
  render: (args) => (
    <Field error="Review this choice." label="Notifications" required>
      <Switch {...args} aria-label={undefined} />
    </Field>
  ),
}

export const Shape: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={keys(switchStyle.props.shape)}>
      {(row) => <Switch {...args} defaultChecked shape={row} />}
    </PropsTable>
  ),
}
