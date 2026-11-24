import type { Meta, StoryObj } from "@storybook/react-vite"
import { Field } from "../field/field"
import { Radio } from "./radio"

const meta = {
  args: { "aria-label": "Standard shipping" },
  component: Radio,
  title: "Components/Radio",
} satisfies Meta<typeof Radio>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const Checked: Story = { args: { defaultChecked: true } }

export const Sizes: Story = {
  render: (args) => (
    <div style={{ alignItems: "center", display: "flex", gap: "0.75rem" }}>
      {(["sm", "md", "lg"] as const).map((size) => (
        <label key={size}>
          <Radio {...args} size={size} aria-label={undefined} defaultChecked />{" "}
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
          <Radio
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
    <Field error="Review this choice." label="Standard shipping" required>
      <Radio {...args} aria-label={undefined} />
    </Field>
  ),
}
