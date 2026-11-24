import type { Meta, StoryObj } from "@storybook/react-vite"
import { Field } from "../field/field"
import { Textarea } from "./textarea"

const meta = {
  args: { "aria-label": "Notes", placeholder: "Add a note" },
  component: Textarea,
  title: "Components/Textarea",
} satisfies Meta<typeof Textarea>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "0.75rem", maxWidth: "24rem" }}>
      {(["sm", "md", "lg"] as const).map((size) => (
        <Textarea
          key={size}
          {...args}
          size={size}
          aria-label={`Notes (${size})`}
          placeholder={size}
        />
      ))}
    </div>
  ),
}

export const Disabled: Story = { args: { disabled: true } }

export const ReadOnly: Story = {
  args: { defaultValue: "This note is archived.", readOnly: true },
}

export const Invalid: Story = {
  render: (args) => (
    <Field error="Add a note before submitting." label="Notes" required>
      <Textarea {...args} aria-label={undefined} />
    </Field>
  ),
}
