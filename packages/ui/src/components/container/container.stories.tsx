import type { Meta, StoryObj } from "@storybook/react-vite"
import { CardRoot } from "../card/card"
import { CardBody } from "../card/card-body"
import { Heading } from "../heading/heading"
import { Container } from "./container"

const meta = {
  args: {
    children: (
      <CardRoot aria-labelledby="account-overview">
        <CardBody>
          <Heading id="account-overview" as="h2">
            Account overview
          </Heading>
        </CardBody>
      </CardRoot>
    ),
  },
  component: Container,
  title: "Components/Container",
} satisfies Meta<typeof Container>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const Sizes: Story = {
  render: (args) => (
    <>
      {(["sm", "md", "lg", "full"] as const).map((size) => (
        <Container {...args} key={size} size={size}>
          <CardRoot>
            <CardBody>Container size: {size}</CardBody>
          </CardRoot>
        </Container>
      ))}
    </>
  ),
}
