import type { Meta, StoryObj } from "@storybook/react-vite"
import { colorSchemes, PropsTable } from "#storybook"
import { Link } from "./link"

const meta = {
  args: { href: "#details", children: "Jump to details" },
  component: Link,
  title: "Components / Link",
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

export const ColorScheme: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={colorSchemes}>
      {(row) => (
        <Link {...args} href="https://example.com" colorScheme={row}>
          Visit Example Domain
        </Link>
      )}
    </PropsTable>
  ),
}

export const External: Story = {
  args: { href: "https://example.com", children: "Visit Example Domain" },
}
