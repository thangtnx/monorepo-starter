import type { Meta, StoryObj } from "@storybook/react-vite"
import { keys, PropsTable } from "#storybook"
import { Field } from "../field/field"
import { Textarea } from "./textarea"
import { textareaStyle } from "./textarea.style"

const meta = {
  args: { "aria-label": "Notes", placeholder: "Add a note" },
  component: Textarea,
  title: "Components / Textarea",
} satisfies Meta<typeof Textarea>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const Size: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={keys(textareaStyle.sizes)}>
      {(row) => (
        <Textarea
          {...args}
          size={row}
          aria-label={"Notes (" + row + ")"}
          placeholder={row}
        />
      )}
    </PropsTable>
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
