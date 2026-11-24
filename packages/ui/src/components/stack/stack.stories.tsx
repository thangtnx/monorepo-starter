import type { Meta, StoryObj } from "@storybook/react-vite"
import { PropsTable } from "#storybook"
import { Button } from "../button/button"
import { Stack } from "./stack"

const actions = (
  <>
    <Button variant="outline">Cancel</Button>
    <Button>Save</Button>
  </>
)

const meta = {
  args: { children: actions },
  component: Stack,
  title: "Components / Stack",
} satisfies Meta<typeof Stack>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = { args: { align: "start" } }

export const Horizontal: Story = {
  args: {
    align: "center",
    direction: "row",
    gap: "2",
    justify: "space-between",
  },
}

export const Gap: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={["2", "4", "8"] as const}>
      {(row) => <Stack {...args} gap={row} />}
    </PropsTable>
  ),
}
