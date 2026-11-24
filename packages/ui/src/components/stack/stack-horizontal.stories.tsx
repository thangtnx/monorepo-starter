import type { Meta, StoryObj } from "@storybook/react-vite"
import { PropsTable } from "#storybook"
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
  title: "Components / HStack",
} satisfies Meta<typeof HStack>

export default meta

export const Basic: StoryObj<typeof meta> = {}

export const Gap: StoryObj<typeof meta> = {
  render: (args) => (
    <PropsTable variant="stack" rows={["2", "4", "8"] as const}>
      {(row) => <HStack {...args} gap={row} />}
    </PropsTable>
  ),
}
