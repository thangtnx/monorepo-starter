import type { Meta, StoryObj } from "@storybook/react-vite"
import { PropsTable } from "#storybook"
import { HStack, Stack, VStack } from "."
import { Button } from "../button/button"

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

export const HStackPreset: Story = {
  name: "HStack",
  render: () => <HStack gap="4">{actions}</HStack>,
}

export const VStackPreset: Story = {
  name: "VStack",
  render: () => (
    <VStack align="start" gap="4">
      {actions}
    </VStack>
  ),
}
