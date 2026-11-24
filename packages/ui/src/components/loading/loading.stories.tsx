import type { Meta, StoryObj } from "@storybook/react-vite"
import { use } from "react"
import { colorSchemes, keys, PropsTable } from "#storybook"
import { Loading } from "./index"
import { loadingSchemes } from "./loading-schemes"

const meta = {
  component: Loading.Oval,
  title: "Components / Loading",
} satisfies Meta<typeof Loading.Oval>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const Variant: Story = {
  render: (args) => (
    <PropsTable columns={keys(loadingSchemes)} rows={colorSchemes}>
      {(scheme, variant) => {
        const Indicator = loadingSchemes[variant]
        return <Indicator {...args} colorScheme={scheme} />
      }}
    </PropsTable>
  ),
}

export const Size: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={["4", "6", "8", "12"] as const}>
      {(row) => <Loading.Oval {...args} height={row} width={row} />}
    </PropsTable>
  ),
}

export const ColorScheme: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={colorSchemes}>
      {(row) => <Loading.Dots {...args} colorScheme={row} />}
    </PropsTable>
  ),
}

export const Audio: Story = { render: (args) => <Loading.Audio {...args} /> }
export const Circles: Story = {
  render: (args) => <Loading.Circles {...args} />,
}
export const Dots: Story = { render: (args) => <Loading.Dots {...args} /> }
export const Grid: Story = { render: (args) => <Loading.Grid {...args} /> }

export const Puff: Story = { render: (args) => <Loading.Puff {...args} /> }
export const Rings: Story = { render: (args) => <Loading.Rings {...args} /> }

export const CustomDurationAndPaint: Story = {
  args: { duration: "2s", secondaryColor: "info.solid" },
}

const previewReady = new Promise<null>(() => {})

function PendingPreview() {
  return use(previewReady)
}

export const SuspenseFallback: Story = {
  render: () => (
    <Loading.Suspense
      loadingScheme="rings"
      loadingProps={{ "aria-label": "Preparing preview" }}
    >
      <PendingPreview />
    </Loading.Suspense>
  ),
}
