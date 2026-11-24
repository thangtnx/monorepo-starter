import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"
import { CheckboxGroup } from "./index"

const items = [
  { label: "Email", value: "email" },
  { label: "Text messages", value: "sms" },
  { label: "Phone calls", value: "phone" },
]

const meta = {
  args: { items, legend: "Contact methods" },
  component: CheckboxGroup.Root,
  title: "Components/CheckboxGroup",
} satisfies Meta<typeof CheckboxGroup.Root>

export default meta

type Story = StoryObj<typeof meta>

export const Items: Story = { args: { defaultValue: ["email"] } }

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
