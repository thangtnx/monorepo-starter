import type { Meta, StoryObj } from "@storybook/react-vite"
import { colorSchemes, keys, PropsTable } from "#storybook"
import { Check, ChevronDown, Icon } from "../icon"
import { Loading as BusyIndicator } from "../loading"
import { Button } from "./button"
import { buttonStyle } from "./button.style"

const row = { display: "flex", flexWrap: "wrap", gap: "0.75rem" } as const

const meta = {
  args: { children: "Continue" },
  component: Button,
  title: "Components / Button",
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const Variant: Story = {
  render: (args) => (
    <PropsTable columns={keys(buttonStyle.variants)} rows={colorSchemes}>
      {(row, column) => (
        <Button {...args} colorScheme={row} variant={column}>
          {column}
        </Button>
      )}
    </PropsTable>
  ),
}

export const Size: Story = {
  render: (args) => (
    <PropsTable columns={keys(buttonStyle.sizes)} rows={colorSchemes}>
      {(row, column) => <Button {...args} colorScheme={row} size={column} />}
    </PropsTable>
  ),
}

export const ColorScheme: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={colorSchemes}>
      {(row) => (
        <Button {...args} colorScheme={row}>
          {row}
        </Button>
      )}
    </PropsTable>
  ),
}

export const Disabled: Story = { args: { disabled: true } }

export const FullWidth: Story = { args: { fullWidth: true } }

export const WithIcons: Story = {
  args: {
    children: "Confirm",
    endIcon: <Icon as={ChevronDown} />,
    startIcon: <Icon as={Check} />,
  },
}

export const Loading: Story = {
  render: () => (
    <div style={row}>
      <Button {...WithIcons.args} loading>
        Confirm
      </Button>
      <Button loading loadingText="Saving settings">
        Save settings
      </Button>
      <Button loading loadingPlacement="end" loadingText="Saving settings">
        Save settings
      </Button>
      <Button
        loading
        loadingIcon="dots"
        loadingProps={{ height: 24, width: 24 }}
      >
        Save settings
      </Button>
      <Button
        loading
        loadingIcon={<BusyIndicator.Puff decorative />}
        loadingText="Saving settings"
      >
        Save settings
      </Button>
    </div>
  ),
}
