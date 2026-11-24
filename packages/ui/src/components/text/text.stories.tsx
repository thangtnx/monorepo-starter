import type { Meta, StoryObj } from "@storybook/react-vite"
import { Text } from "./text"

const meta = {
  args: { children: "Your profile is visible to your team." },
  component: Text,
  title: "Components/Text",
} satisfies Meta<typeof Text>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const Variants: Story = {
  render: () => (
    <>
      <Text variant="body.lg">Your profile is visible to your team.</Text>
      <Text>Change visibility in your settings.</Text>
      <Text variant="body.sm">Only you can see your drafts.</Text>
      <Text variant="label">Profile status</Text>
      <Text variant="caption">Last updated today.</Text>
    </>
  ),
}

export const Inline: Story = {
  render: () => (
    <Text>
      Status:{" "}
      <Text as="span" variant="label">
        Active
      </Text>
    </Text>
  ),
}
