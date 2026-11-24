import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Check,
  ChevronDown,
  CircleAlert,
  CircleCheck,
  Icon,
  Info,
  LoaderCircle,
  TriangleAlert,
  X,
} from "./index"

const meta = {
  component: Icon,
  title: "Components/Icon",
} satisfies Meta<typeof Icon>

export default meta

type Story = StoryObj<typeof meta>

export const Icons: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--spaces-3)" }}>
      <Icon as={Info} size="6" aria-label="Information" color="info.fg" />
      <Icon as={CircleCheck} size="6" aria-label="Success" color="success.fg" />
      <Icon
        as={TriangleAlert}
        size="6"
        aria-label="Warning"
        color="warning.fg"
      />
      <Icon as={CircleAlert} size="6" aria-label="Error" color="danger.fg" />
      <Icon as={LoaderCircle} size="6" aria-label="Loading" />
      <Icon as={Check} size="6" aria-label="Selected" />
      <Icon as={ChevronDown} size="6" aria-label="Expand" />
      <Icon as={X} size="6" aria-label="Clear" />
    </div>
  ),
}
