import type { Meta, StoryObj } from "@storybook/react-vite"
import { keys, PropsTable } from "#storybook"
import { Input } from "./input"
import { inputStyle } from "./input.style"

const meta = {
  args: { "aria-label": "Full name", placeholder: "Full name" },
  component: Input,
  title: "Components / Input",
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const Size: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={keys(inputStyle.sizes)}>
      {(row) => (
        <Input
          {...args}
          size={row}
          aria-label={"Size " + row}
          placeholder={row}
        />
      )}
    </PropsTable>
  ),
}

export const Invalid: Story = { args: { "aria-invalid": true } }

export const ReadOnly: Story = {
  args: { defaultValue: "Read only", readOnly: true },
}

export const Disabled: Story = { args: { disabled: true } }
