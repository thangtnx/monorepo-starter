import type { Meta, StoryObj } from "@storybook/react-vite"
import { Input } from "../input/input"
import { Field } from "./field"

const meta = {
  args: {
    children: <Input type="tel" />,
    hint: "We call you back within one working day.",
    label: "Phone number",
  },
  component: Field,
  title: "Components/Field",
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const Required: Story = { args: { required: true } }

export const Invalid: Story = {
  args: { error: "Enter a 10-digit phone number.", required: true },
}

export const ReadOnly: Story = {
  args: {
    children: <Input type="tel" defaultValue="0901 234 567" />,
    readOnly: true,
  },
}

export const Disabled: Story = { args: { disabled: true } }
