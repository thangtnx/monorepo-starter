import type { Meta, StoryObj } from "@storybook/react-vite"
import { keys, PropsTable } from "#storybook"
import { Text } from "./text"
import { textStyle } from "./text.style"

const meta = {
  args: { children: "Your profile is visible to your team." },
  component: Text,
  title: "Components / Text",
} satisfies Meta<typeof Text>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const Variant: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={keys(textStyle.variants)}>
      {(row) => <Text {...args} variant={row} />}
    </PropsTable>
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
