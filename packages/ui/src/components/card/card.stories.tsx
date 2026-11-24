import type { Meta, StoryObj } from "@storybook/react-vite"
import type { CardRootProps } from "./card"
import { useId } from "react"
import { Button } from "../button/button"
import { Heading } from "../heading/heading"
import { Link } from "../link/link"
import { VStack } from "../stack/stack-vertical"
import { Text } from "../text/text"
import { CardRoot } from "./card"
import { CardBody } from "./card-body"
import { CardFooter } from "./card-footer"
import { CardHeader } from "./card-header"
import { cardStyle } from "./card.style"

function MessageCard({
  title = "Messages",
  ...props
}: Omit<CardRootProps, "title"> & { title?: string }) {
  const titleId = useId()
  const summaryId = useId()

  return (
    <CardRoot {...props} aria-labelledby={titleId}>
      <CardHeader>
        <Heading id={titleId} as="h2">
          {title}
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
}

const meta = {
  component: CardRoot,
  render: (args) => <MessageCard {...args} />,
  title: "Components/Card",
} satisfies Meta<typeof CardRoot>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const Subtle: Story = { args: { variant: "subtle" } }

export const Variants: Story = {
  args: { colorScheme: "primary" },
  render: (args) => (
    <VStack gap="4">
      {Object.keys(cardStyle.variants).map((variant) => (
        <MessageCard
          key={variant}
          {...args}
          variant={variant as keyof typeof cardStyle.variants}
          title={variant}
        />
      ))}
    </VStack>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <VStack gap="4">
      {(["sm", "md", "lg"] as const).map((size) => (
        <CardRoot
          {...args}
          key={size}
          size={size}
          aria-labelledby={`size-${size}`}
        >
          <CardHeader id={`size-${size}`}>
            {size === "sm" ? "Small" : size === "md" ? "Medium" : "Large"}
          </CardHeader>
          <CardBody>Three new messages.</CardBody>
          <CardFooter>
            <Link href="/messages">Open inbox</Link>
          </CardFooter>
        </CardRoot>
      ))}
    </VStack>
  ),
}

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
