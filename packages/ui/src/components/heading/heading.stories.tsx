import type { Meta, StoryObj } from "@storybook/react-vite"
import { Heading } from "./heading"

const meta = {
  args: { as: "h1", children: "Account overview" },
  component: Heading,
  title: "Components/Heading",
} satisfies Meta<typeof Heading>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const Levels: Story = {
  render: () => (
    <>
      <Heading as="h1">Account overview</Heading>
      <Heading as="h2">Settings</Heading>
      <Heading as="h3">Notifications</Heading>
      <Heading as="h4">Email</Heading>
      <Heading as="h5">Weekly digest</Heading>
      <Heading as="h6">Schedule</Heading>
    </>
  ),
}

export const Display: Story = { args: { variant: "display" } }
