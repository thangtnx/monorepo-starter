import type { Meta, StoryObj } from "@storybook/react-vite"
import { PropsTable } from "#storybook"
import { Badge } from "../badge/badge"
import { Grid } from "./grid"

const meta = {
  args: {
    children: (
      <>
        <Badge>Draft</Badge>
        <Badge>In review</Badge>
        <Badge>Published</Badge>
      </>
    ),
  },
  component: Grid,
  title: "Components / Grid",
} satisfies Meta<typeof Grid>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const ThreeColumns: Story = {
  args: { align: "center", columns: 3, gap: "2", justify: "start" },
}

export const Gap: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={["2", "4", "8"] as const}>
      {(row) => <Grid {...args} gap={row} />}
    </PropsTable>
  ),
}
