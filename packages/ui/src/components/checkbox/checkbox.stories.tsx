import type { Meta, StoryObj } from "@storybook/react-vite"
import { Field } from "../field/field"
import { Checkbox } from "./checkbox"

const meta = {
  args: { "aria-label": "Send updates" },
  component: Checkbox,
  title: "Components/Checkbox",
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const Checked: Story = { args: { defaultChecked: true } }

export const Sizes: Story = {
  render: (args) => (
    <div style={{ alignItems: "center", display: "flex", gap: "0.75rem" }}>
      {(["sm", "md", "lg"] as const).map((size) => (
        <label key={size}>
          <Checkbox
            {...args}
            size={size}
            aria-label={undefined}
            defaultChecked
          />{" "}
          {size}
        </label>
      ))}
    </div>
  ),
}

export const ColorSchemes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "0.75rem" }}>
      {(["primary", "info", "success"] as const).map((colorScheme) => (
        <label key={colorScheme}>
          <Checkbox
            {...args}
            colorScheme={colorScheme}
            aria-label={undefined}
            defaultChecked
          />{" "}
          {colorScheme}
        </label>
      ))}
    </div>
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
    <Field error="Review this choice." label="Send updates" required>
      <Checkbox {...args} aria-label={undefined} />
    </Field>
  ),
}
