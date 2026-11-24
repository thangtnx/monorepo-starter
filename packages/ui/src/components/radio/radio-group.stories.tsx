import type { Meta, StoryObj } from "@storybook/react-vite"
import { useId, useState } from "react"
import { colorSchemes, keys, PropsTable } from "#storybook"
import { Radio } from "./radio"
import { RadioGroup } from "./radio-group"
import { radioStyle } from "./radio.style"

function ShippingOptions({ selected = true }: { selected?: boolean }) {
  return (
    <>
      <Radio defaultChecked={selected} value="standard">
        Standard
      </Radio>
      <Radio value="express">Express</Radio>
    </>
  )
}

const meta = {
  args: { children: <ShippingOptions />, legend: "Shipping speed" },
  component: RadioGroup,
  parameters: {
    docs: {
      description: {
        component:
          "RadioGroup labels itself with its legend. Use it outside Field.",
      },
    },
  },
  title: "Components / RadioGroup",
} satisfies Meta<typeof RadioGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const Variant: Story = {
  render: (args) => (
    <PropsTable columns={keys(radioStyle.variants)} rows={colorSchemes}>
      {(row, column) => (
        <RadioGroup {...args} colorScheme={row} variant={column} />
      )}
    </PropsTable>
  ),
}

export const Size: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={keys(radioStyle.sizes)}>
      {(row) => (
        <RadioGroup
          {...args}
          size={row}
          legend={["Shipping speed", row].join(" · ")}
        />
      )}
    </PropsTable>
  ),
}

export const ColorScheme: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={colorSchemes}>
      {(row) => (
        <RadioGroup
          {...args}
          colorScheme={row}
          legend={["Shipping speed", row].join(" · ")}
        />
      )}
    </PropsTable>
  ),
}

export const Items: Story = {
  render: () => (
    <RadioGroup.Root
      defaultValue="standard"
      items={[
        { label: "Standard", value: "standard" },
        { label: "Express", value: "express" },
      ]}
      legend="Shipping speed"
    />
  ),
}

export const Controlled: Story = {
  render: function ControlledGroup() {
    const [value, setValue] = useState("standard")
    return (
      <RadioGroup.Root
        legend="Shipping speed"
        value={value}
        onChange={setValue}
      >
        <RadioGroup.Item value="standard">Standard</RadioGroup.Item>
        <RadioGroup.Item value="express">Express</RadioGroup.Item>
      </RadioGroup.Root>
    )
  },
}

export const Disabled: Story = { args: { disabled: true } }

export const ReadOnly: Story = { args: { readOnly: true } }

export const Invalid: Story = {
  render: function InvalidRadioGroup(args) {
    const errorId = useId()
    return (
      <>
        <RadioGroup {...args} aria-describedby={errorId} aria-invalid required>
          <ShippingOptions selected={false} />
        </RadioGroup>
        <span id={errorId}>Choose a shipping speed.</span>
      </>
    )
  },
}

export const Required: Story = { args: { required: true } }
