import type { Meta, StoryObj } from "@storybook/react-vite"
import { Field } from "../field/field"
import { Select } from "./select"

const meta = {
  args: {
    "aria-label": "Contact method",
    children: (
      <>
        <option value="">Choose a method</option>
        <option value="email">Email</option>
        <option value="post">Post</option>
        <option value="phone">Phone</option>
      </>
    ),
  },
  component: Select,
  title: "Components/Select",
} satisfies Meta<typeof Select>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const Multiple: Story = {
  args: {
    "aria-label": "Contact methods",
    defaultValue: ["email", "phone"],
    multiple: true,
    visibleRows: 4,
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "0.75rem", maxWidth: "24rem" }}>
      {(["sm", "md", "lg"] as const).map((size) => (
        <Select
          key={size}
          {...args}
          size={size}
          aria-label={`Contact method (${size})`}
        />
      ))}
    </div>
  ),
}

export const Disabled: Story = { args: { disabled: true } }

export const ReadOnly: Story = {
  args: { defaultValue: "email", readOnly: true },
}

export const Invalid: Story = {
  render: (args) => (
    <Field error="Choose a contact method." label="Contact method" required>
      <Select {...args} aria-label={undefined} />
    </Field>
  ),
}
