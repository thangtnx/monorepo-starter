import type { Meta, StoryObj } from "@storybook/react-vite"
import { colorSchemes, keys, PropsTable } from "#storybook"
import { Field } from "../field/field"
import { Checkbox } from "./checkbox"
import { checkboxStyle } from "./checkbox.style"

const meta = {
  args: { "aria-label": "Send updates" },
  component: Checkbox,
  title: "Components / Checkbox",
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const Variant: Story = {
  render: (args) => (
    <PropsTable columns={keys(checkboxStyle.variants)} rows={colorSchemes}>
      {(row, column) => (
        <Checkbox {...args} colorScheme={row} variant={column} defaultChecked />
      )}
    </PropsTable>
  ),
}

export const Size: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={keys(checkboxStyle.sizes)}>
      {(row) => (
        <Checkbox {...args} size={row} aria-label={row} defaultChecked />
      )}
    </PropsTable>
  ),
}

export const ColorScheme: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={colorSchemes}>
      {(row) => (
        <Checkbox {...args} colorScheme={row} aria-label={row} defaultChecked />
      )}
    </PropsTable>
  ),
}

export const Checked: Story = { args: { defaultChecked: true } }

export const Mixed: Story = {
  args: {
    "aria-label": undefined,
    children: "Select all",
    indeterminate: true,
    indeterminateIcon: "–",
    indicatorProps: { title: "Some items selected" },
    labelProps: { title: "Choose all items" },
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
    <Field error="Review this choice." label="Send updates" required>
      <Checkbox {...args} aria-label={undefined} />
    </Field>
  ),
}

export const Shape: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={keys(checkboxStyle.props.shape)}>
      {(row) => <Checkbox {...args} defaultChecked shape={row} />}
    </PropsTable>
  ),
}
