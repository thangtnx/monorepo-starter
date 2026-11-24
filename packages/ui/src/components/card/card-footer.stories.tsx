import type { Meta, StoryObj } from "@storybook/react-vite"
import type { CardFooterProps } from "./card-footer"
import { CardRoot } from "./card"
import { CardBody } from "./card-body"
import { CardFooter } from "./card-footer"
import { CardHeader } from "./card-header"

const meta = {
  args: { children: <a href="/messages">Read messages</a> },
  component: CardFooter,
  title: "Components / CardFooter",
} satisfies Meta<CardFooterProps>

export default meta

export const Basic: StoryObj<typeof meta> = {
  render: (args) => (
    <CardRoot size="sm" aria-labelledby="card-footer-summary">
      <CardHeader>
        <h2 id="card-footer-summary">Summary</h2>
      </CardHeader>
      <CardBody>Three new messages.</CardBody>
      <CardFooter {...args} />
    </CardRoot>
  ),
}
