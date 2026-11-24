import type { Meta, StoryObj } from "@storybook/react-vite"
import { Field } from "../field/field"
import { Switch } from "./switch"

const meta = {
  args: { "aria-label": "Notifications" },
  component: Switch,
  title: "Components/Switch",
} satisfies Meta<typeof Switch>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const Checked: Story = { args: { defaultChecked: true } }

export const Parts: Story = {
  args: {
    "aria-label": undefined,
    children: "Notifications",
    icon: { off: "−", on: "✓" },
    inputProps: { name: "notifications" },
    labelProps: { title: "Notifications" },
    thumbProps: { title: "Toggle" },
    trackProps: { title: "Notification state" },
  },
}

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem" }}>
      <Switch variant="thin" defaultChecked shape="rounded">
        Thin
      </Switch>
      <Switch variant="thick" reverse shape="square">
        Thick
      </Switch>
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ alignItems: "center", display: "flex", gap: "0.75rem" }}>
      {(["sm", "md", "lg"] as const).map((size) => (
        <label key={size}>
          <Switch {...args} size={size} aria-label={undefined} defaultChecked />{" "}
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
          <Switch
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
    <Field error="Review this choice." label="Notifications" required>
      <Switch {...args} aria-label={undefined} />
    </Field>
  ),
}
