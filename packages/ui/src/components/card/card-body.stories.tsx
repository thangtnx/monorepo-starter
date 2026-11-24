import type { Meta, StoryObj } from "@storybook/react-vite"
import type { CardBodyProps } from "./card-body"
import { CardRoot } from "./card"
import { CardBody } from "./card-body"
import { CardHeader } from "./card-header"

const meta = {
  args: { children: <p>Three new messages.</p> },
  component: CardBody,
  title: "Components / CardBody",
} satisfies Meta<CardBodyProps>

export default meta

export const Basic: StoryObj<typeof meta> = {
  render: (args) => (
    <CardRoot size="md" aria-labelledby="card-body-summary">
      <CardHeader>
        <h2 id="card-body-summary">Summary</h2>
      </CardHeader>
      <CardBody {...args} />
    </CardRoot>
  ),
}
