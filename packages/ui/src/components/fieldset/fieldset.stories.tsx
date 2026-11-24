import type { Meta, StoryObj } from "@storybook/react-vite"
import { useId } from "react"
import { PropsTable } from "#storybook"
import { Checkbox } from "../checkbox/checkbox"
import { Fieldset } from "./fieldset"

function ContactOptions() {
  const id = useId()
  return (
    <>
      <label htmlFor={`${id}-email`}>
        <Checkbox id={`${id}-email`} name="contact" value="email" /> Email
      </label>
      <div>
        <Checkbox id={`${id}-sms`} name="contact" value="sms" />{" "}
        <label htmlFor={`${id}-sms`}>SMS</label>
      </div>
    </>
  )
}

const meta = {
  args: {
    children: <ContactOptions />,
    hint: "Choose how we can contact you.",
    legend: "Contact preferences",
  },
  component: Fieldset,
  title: "Components / Fieldset",
} satisfies Meta<typeof Fieldset>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const Size: Story = {
  render: (args) => (
    <PropsTable variant="stack" rows={["sm", "md", "lg"] as const}>
      {(row) => (
        <Fieldset
          {...args}
          size={row}
          legend={"Contact preferences (" + row + ")"}
        />
      )}
    </PropsTable>
  ),
}

export const Required: Story = { args: { required: true } }

export const Invalid: Story = {
  args: { error: "Choose at least one contact channel.", required: true },
}

export const Disabled: Story = { args: { disabled: true } }
