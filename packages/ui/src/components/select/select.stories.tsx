import type { Meta, StoryObj } from "@storybook/react-vite"
import { colorSchemes, keys, PropsTable } from "#storybook"
import { Field } from "../field/field"
import { Select } from "./index"
import { selectStyle } from "./select.style"

const items = [
  { label: "Email", value: "email" },
  { label: "Phone", value: "phone" },
  { disabled: true, label: "Post", value: "post" },
  { label: "Text message", value: "sms" },
]

const meta = {
  args: {
    "aria-label": "Contact method",
    items,
    placeholder: "Choose a contact method",
  },
  component: Select.Root,
  title: "Components / Select",
} satisfies Meta<typeof Select.Root>

export default meta

type Story = StoryObj<typeof Select.Root>

export const Basic: Story = {}

export const Variant: Story = {
  render: (args) => (
    <PropsTable columns={keys(selectStyle.variants)} rows={colorSchemes}>
      {(row, column) => (
        <Select.Root
          {...args}
          colorScheme={row}
          variant={column}
          aria-label={["Contact method", row, column].join(" · ")}
          defaultValue="email"
        />
      )}
    </PropsTable>
  ),
}

export const Size: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={keys(selectStyle.sizes)}>
      {(row) => (
        <Select.Root
          {...args}
          size={row}
          aria-label={"Contact method (" + row + ")"}
        />
      )}
    </PropsTable>
  ),
}

export const ColorScheme: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={colorSchemes}>
      {(row) => (
        <Select.Root
          {...args}
          colorScheme={row}
          aria-label={"Contact method (" + row + ")"}
          defaultValue="email"
        />
      )}
    </PropsTable>
  ),
}

export const Disabled: Story = { args: { disabled: true } }

export const ReadOnly: Story = {
  args: { defaultValue: "email", readOnly: true },
}

export const Invalid: Story = {
  render: (args) => (
    <Field error="Choose a contact method." label="Contact method" required>
      <Select.Root {...args} aria-label={undefined} />
    </Field>
  ),
}

export const InField: Story = {
  render: (args) => (
    <Field hint="Used for delivery updates." label="Contact method">
      <Select.Root {...args} aria-label={undefined} />
    </Field>
  ),
}

export const Groups: Story = {
  render: (args) => (
    <Select.Root {...args} defaultValue="email" items={undefined}>
      <Select.Group>
        <Select.Label>Online</Select.Label>
        <Select.Option value="email">Email</Select.Option>
        <Select.Option value="sms">Text message</Select.Option>
      </Select.Group>
      <Select.Separator />
      <Select.Group label="Offline">
        <Select.Option value="phone">Phone</Select.Option>
        <Select.Option disabled value="post">
          Post
        </Select.Option>
      </Select.Group>
    </Select.Root>
  ),
}

export const Multiple: Story = {
  args: {
    "aria-label": "Contact methods",
    defaultValue: ["email", "phone"],
    max: 2,
    multiple: true,
    separator: " / ",
  },
}

export const Clearable: Story = {
  args: {
    clearable: true,
    defaultValue: "sms",
    render: ({ label }) => <strong>{label}</strong>,
  },
}

export const LongList: Story = {
  args: {
    "aria-label": "Time slot",
    items: Array.from({ length: 48 }, (_, index) => {
      const hours = String(Math.floor(index / 2)).padStart(2, "0")
      const minutes = index % 2 === 0 ? "00" : "30"
      const time = `${hours}:${minutes}`
      return { label: time, value: time }
    }),
    placeholder: "Choose a time slot",
  },
}
