import type { Meta, StoryObj } from "@storybook/react-vite"
import type { RadioProps } from "./radio"
import { useId } from "react"
import { colorSchemes, keys, PropsTable } from "#storybook"
import { Field } from "../field/field"
import { Radio } from "./radio"
import { radioStyle } from "./radio.style"

function RadioPair({
  labelPrefix,
  ...props
}: RadioProps & { labelPrefix: string }) {
  const name = useId()

  return (
    <div style={{ display: "flex", gap: "0.75rem" }}>
      <Radio {...props} name={name} defaultChecked value="a">
        {labelPrefix} A
      </Radio>
      <Radio {...props} name={name} value="b">
        {labelPrefix} B
      </Radio>
    </div>
  )
}

const meta = {
  args: { "aria-label": "Standard shipping" },
  component: Radio,
  title: "Components / Radio",
} satisfies Meta<typeof Radio>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: { "aria-label": undefined, children: "Standard shipping" },
}

export const Variant: Story = {
  render: (args) => (
    <PropsTable columns={keys(radioStyle.variants)} rows={colorSchemes}>
      {(row, column) => (
        <RadioPair
          {...args}
          colorScheme={row}
          variant={column}
          aria-label={undefined}
          labelPrefix={column}
        />
      )}
    </PropsTable>
  ),
}

export const Size: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={keys(radioStyle.sizes)}>
      {(row) => (
        <RadioPair
          {...args}
          size={row}
          aria-label={undefined}
          labelPrefix={row}
        />
      )}
    </PropsTable>
  ),
}

export const ColorScheme: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={colorSchemes}>
      {(row) => (
        <RadioPair
          {...args}
          colorScheme={row}
          aria-label={undefined}
          labelPrefix={row}
        />
      )}
    </PropsTable>
  ),
}

export const Checked: Story = { args: { defaultChecked: true } }

export const Shape: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={keys(radioStyle.props.shape)}>
      {(row) => (
        <RadioPair
          {...args}
          aria-label={undefined}
          labelPrefix={row}
          shape={row}
        />
      )}
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
