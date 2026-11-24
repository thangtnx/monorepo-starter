import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "../button/button"
import { HStack } from "./stack-horizontal"

const meta = {
  args: {
    align: "start",
    children: (
      <>
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
      </>
    ),
  },
  component: HStack,
  title: "Components/Stack/HStack",
} satisfies Meta<typeof HStack>

export default meta

export const Basic: StoryObj<typeof meta> = {}
