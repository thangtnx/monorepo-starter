import type { Meta, StoryObj } from "@storybook/react-vite"
import { Link } from "./link"

const meta = {
  args: { href: "#details", children: "Jump to details" },
  component: Link,
  title: "Components/Link",
} satisfies Meta<typeof Link>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: (args) => (
    <>
      <Link {...args} />
      <p id="details">Details for this example.</p>
    </>
  ),
}

export const External: Story = {
  args: { href: "https://example.com", children: "Visit Example Domain" },
}
