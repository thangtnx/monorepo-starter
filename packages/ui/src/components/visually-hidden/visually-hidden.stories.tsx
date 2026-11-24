import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "../button/button"
import { VisuallyHidden } from "./visually-hidden"

const meta = {
  args: { children: "Close" },
  component: VisuallyHidden,
  title: "Components/VisuallyHidden",
} satisfies Meta<typeof VisuallyHidden>

export default meta

type Story = StoryObj<typeof meta>

/** The button below has no visible text; screen readers announce "Close". */
export const InsideButton: Story = {
  render: (args) => (
    <Button variant="outline">
      <span aria-hidden="true">✕</span>
      <VisuallyHidden {...args} />
    </Button>
  ),
}
