import type { Meta, StoryObj } from "@storybook/react-vite"
import { CardRoot } from "./card"
import { CardBody } from "./card-body"
import { CardHeader } from "./card-header"

const meta = {
  args: { children: <h2 id="card-header-summary">Summary</h2> },
  component: CardHeader,
  title: "Components/Card/Header",
} satisfies Meta<typeof CardHeader>

export default meta

export const Basic: StoryObj<typeof meta> = {
  render: (args) => (
    <CardRoot size="lg" aria-labelledby="card-header-summary">
      <CardHeader {...args} />
      <CardBody>Three new messages.</CardBody>
    </CardRoot>
  ),
}
