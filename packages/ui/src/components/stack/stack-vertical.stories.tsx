import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "../button/button"
import { VStack } from "./stack-vertical"

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
  component: VStack,
  title: "Components/Stack/VStack",
} satisfies Meta<typeof VStack>

export default meta

export const Basic: StoryObj<typeof meta> = {}
