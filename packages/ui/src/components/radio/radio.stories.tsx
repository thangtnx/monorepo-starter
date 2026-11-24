import type { Meta, StoryObj } from "@storybook/react-vite"
import { colorSchemes, keys, PropsTable } from "#storybook"
import { Field } from "../field/field"
import { Radio } from "./radio"
import { radioStyle } from "./radio.style"

const meta = {
  args: { "aria-label": "Standard shipping" },
  component: Radio,
  title: "Components / Radio",
} satisfies Meta<typeof Radio>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const Variant: Story = {
  render: (args) => (
    <PropsTable columns={keys(radioStyle.variants)} rows={colorSchemes}>
      {(row, column) => (
        <Radio {...args} colorScheme={row} variant={column} defaultChecked />
      )}
    </PropsTable>
  ),
}

export const Size: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={keys(radioStyle.sizes)}>
      {(row) => <Radio {...args} size={row} aria-label={row} defaultChecked />}
    </PropsTable>
  ),
}

export const ColorScheme: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={colorSchemes}>
      {(row) => (
        <Radio {...args} colorScheme={row} aria-label={row} defaultChecked />
      )}
    </PropsTable>
  ),
}

export const Checked: Story = { args: { defaultChecked: true } }

export const Shape: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={keys(radioStyle.props.shape)}>
      {(row) => <Radio {...args} defaultChecked shape={row} />}
    </PropsTable>
  ),
}

export const Disabled: Story = {
  args: { defaultChecked: true, disabled: true },
}

export const ReadOnly: Story = {
  args: { defaultChecked: true, readOnly: true },
}

export const Invalid: Story = {
  render: (args) => (
    <Field error="Review this choice." label="Standard shipping" required>
      <Radio {...args} aria-label={undefined} />
    </Field>
  ),
}
