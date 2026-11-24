import type { Meta, StoryObj } from "@storybook/react-vite"
import { colorSchemes } from "../../theme/semantic-tokens/color-schemes"
import { Badge } from "./badge"
import { badgeStyle } from "./badge.style"

const row = { display: "flex", flexWrap: "wrap", gap: "0.75rem" } as const

const meta = {
  args: { children: "Draft" },
  component: Badge,
  title: "Components/Badge",
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div style={row}>
      {Object.keys(badgeStyle.variants).map((variant) => (
        <Badge
          key={variant}
          {...args}
          variant={variant as keyof typeof badgeStyle.variants}
        >
          {variant}
        </Badge>
      ))}
    </div>
  ),
}

export const ColorSchemes: Story = {
  render: (args) => (
    <div style={row}>
      {colorSchemes.map((colorScheme) => (
        <Badge key={colorScheme} {...args} colorScheme={colorScheme}>
          {colorScheme}
        </Badge>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ ...row, alignItems: "center" }}>
      {Object.keys(badgeStyle.sizes).map((size) => (
        <Badge
          key={size}
          {...args}
          size={size as keyof typeof badgeStyle.sizes}
        >
          {size}
        </Badge>
      ))}
    </div>
  ),
}
