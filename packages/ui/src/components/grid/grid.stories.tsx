import type { Meta, StoryObj } from "@storybook/react-vite"
import { PropsTable } from "#storybook"
import { Badge } from "../badge/badge"
import { Card } from "../card"
import { Grid } from "./grid"
import { GridItem } from "./grid-item"

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

export const TemplateColumns: Story = {
  render: () => (
    <Grid gap="4" templateColumns="14rem 1fr 10rem">
      <Card.Root variant="subtle">
        <Card.Body>Sidebar (14rem)</Card.Body>
      </Card.Root>
      <Card.Root>
        <Card.Body>Main content (1fr)</Card.Body>
      </Card.Root>
      <Card.Root variant="subtle">
        <Card.Body>Aside (10rem)</Card.Body>
      </Card.Root>
    </Grid>
  ),
}

export const TemplateAreas: Story = {
  render: () => (
    <Grid
      gap="4"
      templateAreas='"header header" "nav main" "footer footer"'
      templateColumns="12rem 1fr"
      templateRows="auto 8rem auto"
    >
      <GridItem area="header">
        <Card.Root colorScheme="primary" variant="subtle">
          <Card.Body>Header</Card.Body>
        </Card.Root>
      </GridItem>
      <GridItem area="nav">
        <Card.Root variant="subtle">
          <Card.Body>Navigation</Card.Body>
        </Card.Root>
      </GridItem>
      <GridItem area="main">
        <Card.Root>
          <Card.Body>Main</Card.Body>
        </Card.Root>
      </GridItem>
      <GridItem area="footer">
        <Card.Root variant="subtle">
          <Card.Body>Footer</Card.Body>
        </Card.Root>
      </GridItem>
    </Grid>
  ),
}

export const Spanning: Story = {
  render: () => (
    <Grid columns={4} gap="4">
      <GridItem colSpan={2} rowSpan={2}>
        <Card.Root colorScheme="primary" variant="subtle">
          <Card.Body>2x2 Feature</Card.Body>
        </Card.Root>
      </GridItem>
      <GridItem>
        <Card.Root>
          <Card.Body>Item 2</Card.Body>
        </Card.Root>
      </GridItem>
      <GridItem>
        <Card.Root>
          <Card.Body>Item 3</Card.Body>
        </Card.Root>
      </GridItem>
      <GridItem colSpan={2}>
        <Card.Root>
          <Card.Body>Span 2 columns</Card.Body>
        </Card.Root>
      </GridItem>
      <GridItem colSpan="full">
        <Card.Root variant="subtle">
          <Card.Body>Full row</Card.Body>
        </Card.Root>
      </GridItem>
    </Grid>
  ),
}

export const AutoFit: Story = {
  render: () => (
    <Grid gap="4" minChildWidth="12rem">
      <Card.Root>
        <Card.Body>Card 1</Card.Body>
      </Card.Root>
      <Card.Root>
        <Card.Body>Card 2</Card.Body>
      </Card.Root>
      <Card.Root>
        <Card.Body>Card 3</Card.Body>
      </Card.Root>
      <Card.Root>
        <Card.Body>Card 4</Card.Body>
      </Card.Root>
    </Grid>
  ),
}

export const AutoFlow: Story = {
  render: () => (
    <Grid columns={3} flow="dense" gap="4">
      <GridItem colSpan={2}>
        <Card.Root colorScheme="info" variant="subtle">
          <Card.Body>Wide 1 (colSpan 2)</Card.Body>
        </Card.Root>
      </GridItem>
      <GridItem colSpan={2}>
        <Card.Root colorScheme="info" variant="subtle">
          <Card.Body>Wide 2 (colSpan 2)</Card.Body>
        </Card.Root>
      </GridItem>
      <GridItem>
        <Card.Root>
          <Card.Body>Dense fills gap</Card.Body>
        </Card.Root>
      </GridItem>
    </Grid>
  ),
}
