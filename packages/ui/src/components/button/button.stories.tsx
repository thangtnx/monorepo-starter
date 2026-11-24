import type { Meta, StoryObj } from "@storybook/react-vite"
import { colorSchemes } from "../../theme/semantic-tokens/color-schemes"
import { Button } from "./button"
import { buttonStyle } from "./button.style"

const row = { display: "flex", flexWrap: "wrap", gap: "0.75rem" } as const

const meta = {
  args: { children: "Continue" },
  component: Button,
  title: "Components/Button",
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div style={row}>
      {Object.keys(buttonStyle.variants).map((variant) => (
        <Button
          key={variant}
          {...args}
          variant={variant as keyof typeof buttonStyle.variants}
        >
          {variant}
        </Button>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ ...row, alignItems: "center" }}>
      {Object.keys(buttonStyle.sizes).map((size) => (
        <Button
          key={size}
          {...args}
          size={size as keyof typeof buttonStyle.sizes}
        >
          {size}
        </Button>
      ))}
    </div>
  ),
}

export const ColorSchemes: Story = {
  render: (args) => (
    <div style={row}>
      {colorSchemes.map((colorScheme) => (
        <Button key={colorScheme} {...args} colorScheme={colorScheme}>
          {colorScheme}
        </Button>
      ))}
    </div>
  ),
}

export const Disabled: Story = { args: { disabled: true } }

export const FullWidth: Story = { args: { fullWidth: true } }
