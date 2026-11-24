import type { Meta, StoryObj } from "@storybook/react-vite"
import { Ripple } from "./ripple"
import { useRipple } from "./use-ripple"

function RippleDemo({ disabled = false }: { disabled?: boolean }) {
  const { ripples, onBlur, onClear, onPointerDown, onPointerLeave } = useRipple(
    { disabled },
  )

  return (
    <button
      type="button"
      style={{
        background: "var(--colors-bg-panel)",
        border: "1px solid var(--colors-border-emphasized)",
        borderRadius: "var(--radii-md)",
        color: "var(--colors-fg)",
        cursor: disabled ? "not-allowed" : "pointer",
        padding: "var(--spaces-4) var(--spaces-6)",
        position: "relative",
      }}
      onBlur={onBlur}
      onPointerDown={onPointerDown}
      onPointerLeave={onPointerLeave}
    >
      {disabled ? "Ripple disabled" : "Click anywhere inside"}
      <Ripple disabled={disabled} ripples={ripples} onClear={onClear} />
    </button>
  )
}

const meta = {
  component: RippleDemo,
  title: "Components / Ripple",
} satisfies Meta<typeof RippleDemo>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const Disabled: Story = {
  args: { disabled: true },
}
