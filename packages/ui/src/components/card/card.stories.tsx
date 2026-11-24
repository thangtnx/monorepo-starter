import type { Meta, StoryObj } from "@storybook/react-vite"
import type { CardRootProps } from "./card"
import { useId } from "react"
import { colorSchemes, keys, PropsTable } from "#storybook"
import { Button } from "../button/button"
import { Heading } from "../heading/heading"
import { Link } from "../link/link"
import { Text } from "../text/text"
import { CardRoot } from "./card"
import { CardBody } from "./card-body"
import { CardFooter } from "./card-footer"
import { CardHeader } from "./card-header"
import { cardStyle } from "./card.style"

function MessageCard(props: CardRootProps) {
  return (
    <CardRoot {...props}>
      <CardHeader>
        <Heading as="h2" variant="h4">
          Messages
        </Heading>
      </CardHeader>
      <CardBody>Three unread.</CardBody>
    </CardRoot>
  )
}

const meta = {
  component: CardRoot,
  title: "Components / Card",
} satisfies Meta<typeof CardRoot>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: function MessageSummary(args) {
    const titleId = useId()
    const summaryId = useId()

    return (
      <CardRoot {...args} aria-labelledby={titleId}>
        <CardHeader>
          <Heading id={titleId} as="h2">
            Messages
          </Heading>
        </CardHeader>
        <CardBody>
          <Text id={summaryId}>Three new messages.</Text>
        </CardBody>
        <CardFooter>
          <Link href={`#${summaryId}`}>Jump to summary</Link>
        </CardFooter>
      </CardRoot>
    )
  },
}

export const Variant: Story = {
  render: (args) => (
    <PropsTable columns={colorSchemes} rows={keys(cardStyle.variants)}>
      {(row, column) => (
        <MessageCard {...args} colorScheme={column} variant={row} />
      )}
    </PropsTable>
  ),
}

export const Size: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={keys(cardStyle.sizes)}>
      {(row) => <MessageCard {...args} size={row} />}
    </PropsTable>
  ),
}

export const ColorScheme: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={colorSchemes}>
      {(row) => <MessageCard {...args} colorScheme={row} variant="subtle" />}
    </PropsTable>
  ),
}

export const Subtle: Story = { ...Basic, args: { variant: "subtle" } }

export const Actions: Story = {
  render: (args) => (
    <CardRoot {...args} aria-labelledby="notification-settings">
      <CardHeader>
        <Heading id="notification-settings" as="h2">
          Notification settings
        </Heading>
        <Button variant="outline">Preview</Button>
      </CardHeader>
      <CardBody>Choose how you receive updates.</CardBody>
      <CardFooter>
        <Button variant="outline">Cancel</Button>
        <Button>Save settings</Button>
      </CardFooter>
    </CardRoot>
  ),
}
