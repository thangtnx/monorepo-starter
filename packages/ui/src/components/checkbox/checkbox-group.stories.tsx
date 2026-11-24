import type { Meta, StoryObj } from "@storybook/react-vite"
import { useId, useState } from "react"
import { colorSchemes, keys, PropsTable } from "#storybook"
import { checkboxStyle } from "./checkbox.style"
import { CheckboxGroup } from "./index"

const items = [
  { label: "Email", value: "email" },
  { label: "Text messages", value: "sms" },
  { label: "Phone calls", value: "phone" },
]

const meta = {
  args: { items, legend: "Contact methods" },
  component: CheckboxGroup.Root,
  title: "Components / CheckboxGroup",
} satisfies Meta<typeof CheckboxGroup.Root>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = { args: { defaultValue: ["email"] } }

export const Variant: Story = {
  render: (args) => (
    <PropsTable columns={keys(checkboxStyle.variants)} rows={colorSchemes}>
      {(row, column) => (
        <CheckboxGroup.Root
          {...args}
          colorScheme={row}
          variant={column}
          defaultValue={["email"]}
        />
      )}
    </PropsTable>
  ),
}

export const Size: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={keys(checkboxStyle.sizes)}>
      {(row) => (
        <CheckboxGroup.Root
          {...args}
          size={row}
          defaultValue={["email"]}
          legend={["Contact methods", row].join(" · ")}
        />
      )}
    </PropsTable>
  ),
}

export const ColorScheme: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={colorSchemes}>
      {(row) => (
        <CheckboxGroup.Root
          {...args}
          colorScheme={row}
          defaultValue={["email"]}
          legend={["Contact methods", row].join(" · ")}
        />
      )}
    </PropsTable>
  ),
}

export const RequiredWithLimit: Story = {
  args: { defaultValue: ["email"], max: 1, required: true },
}

export const Controlled: Story = {
  render: function ControlledGroup(args) {
    const [value, setValue] = useState(["email"])
    return (
      <CheckboxGroup.Root {...args} value={value} onChange={setValue}>
        <CheckboxGroup.Item value="email">Email</CheckboxGroup.Item>
        <CheckboxGroup.Item value="sms">Text messages</CheckboxGroup.Item>
      </CheckboxGroup.Root>
    )
  },
}

export const Disabled: Story = {
  args: { defaultValue: ["email"], disabled: true },
}

export const ReadOnly: Story = {
  args: { defaultValue: ["email"], readOnly: true },
}

export const Invalid: Story = {
  render: function InvalidCheckboxGroup(args) {
    const errorId = useId()
    return (
      <>
        <CheckboxGroup.Root
          {...args}
          aria-describedby={errorId}
          invalid
          required
        />
        <span id={errorId}>Choose a contact method.</span>
      </>
    )
  },
}
