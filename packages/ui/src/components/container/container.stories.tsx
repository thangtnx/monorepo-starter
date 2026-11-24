import type { Meta, StoryObj } from "@storybook/react-vite"
import { PropsTable } from "#storybook"
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
  title: "Components / Container",
} satisfies Meta<typeof Container>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = { parameters: { layout: "unstyled" } }

export const Size: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={["sm", "md", "lg", "full"] as const}>
      {(row) => (
        <Container {...args} size={row}>
          <CardRoot>
            <CardBody>Account overview</CardBody>
          </CardRoot>
        </Container>
      )}
    </PropsTable>
  ),
}
