import type { Meta, StoryObj } from "@storybook/react-vite"
import { Input } from "./input"
import { inputStyle } from "./input.style"

const meta = {
  args: { "aria-label": "Full name", placeholder: "Full name" },
  component: Input,
  title: "Components/Input",
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "0.75rem", maxWidth: "24rem" }}>
      {Object.keys(inputStyle.sizes).map((size) => (
        <Input
          key={size}
          {...args}
          size={size as keyof typeof inputStyle.sizes}
          aria-label={`Size ${size}`}
          placeholder={size}
        />
      ))}
    </div>
  ),
}

export const Invalid: Story = { args: { "aria-invalid": true } }

export const ReadOnly: Story = {
  args: { defaultValue: "Read only", readOnly: true },
}

export const Disabled: Story = { args: { disabled: true } }
