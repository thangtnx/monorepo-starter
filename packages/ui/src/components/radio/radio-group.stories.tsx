import type { Meta, StoryObj } from "@storybook/react-vite"
import { useId } from "react"
import { Radio } from "./radio"
import { RadioGroup } from "./radio-group"

function ShippingOptions({ selected = true }: { selected?: boolean }) {
  const id = useId()
  const standardId = `${id}-standard`
  const expressId = `${id}-express`

  return (
    <>
      <label htmlFor={standardId}>
        <Radio id={standardId} defaultChecked={selected} value="standard" />{" "}
        Standard
      </label>
      <label htmlFor={expressId}>
        <Radio id={expressId} value="express" /> Express
      </label>
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
  title: "Components/RadioGroup",
} satisfies Meta<typeof RadioGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem" }}>
      {(["sm", "md", "lg"] as const).map((size) => (
        <RadioGroup
          key={size}
          {...args}
          size={size}
          legend={`Shipping speed (${size})`}
        />
      ))}
    </div>
  ),
}

export const ColorSchemes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem" }}>
      {(["primary", "info", "success"] as const).map((colorScheme) => (
        <RadioGroup
          key={colorScheme}
          {...args}
          colorScheme={colorScheme}
          legend={`Shipping speed (${colorScheme})`}
        />
      ))}
    </div>
  ),
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
