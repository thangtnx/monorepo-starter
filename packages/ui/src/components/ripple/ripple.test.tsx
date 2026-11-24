import { act, fireEvent } from "@testing-library/react"
import { a11y, render, screen } from "#test"
import { Ripple } from "./ripple"
import { useRipple } from "./use-ripple"

function DemoSurface({ disabled = false }: { disabled?: boolean }) {
  const { ripples, onBlur, onClear, onPointerDown, onPointerLeave } = useRipple(
    { disabled },
  )

  return (
    <button
      type="button"
      style={{ height: 48, position: "relative", width: 120 }}
      onBlur={onBlur}
      onPointerDown={onPointerDown}
      onPointerLeave={onPointerLeave}
    >
      Press
      <Ripple disabled={disabled} ripples={ripples} onClear={onClear} />
    </button>
  )
}

describe("<Ripple />", () => {
  test("holds the wave briefly before releasing and clearing on transitionEnd", () => {
    vi.useFakeTimers()
    try {
      render(<DemoSurface />)

      const button = screen.getByRole("button", { name: "Press" })
      expect(button.querySelector(".ui-ripple")).not.toBeInTheDocument()

      fireEvent.pointerDown(button, { button: 0, clientX: 20, clientY: 16 })

      const ripple = button.querySelector(".ui-ripple")
      const wave = ripple?.querySelector<HTMLElement>('[data-part="wave"]')
      expect(ripple).toHaveAttribute("aria-hidden", "true")
      expect(wave).toHaveAttribute("data-state", "active")
      expect(wave?.style.getPropertyValue("--ripple-duration")).toMatch(
        /^\d+ms$/,
      )

      fireEvent.pointerUp(window)
      expect(wave).toHaveAttribute("data-state", "active")

      act(() => {
        vi.advanceTimersByTime(220)
      })
      expect(wave).toHaveAttribute("data-state", "released")

      fireEvent.transitionEnd(wave!)
      expect(button.querySelector(".ui-ripple")).not.toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })

  test("clears held waves when disabled becomes true so they do not replay", () => {
    vi.useFakeTimers()
    try {
      const { rerender } = render(<DemoSurface />)
      const button = screen.getByRole("button", { name: "Press" })

      fireEvent.pointerDown(button, { button: 0, clientX: 20, clientY: 16 })
      expect(
        button.querySelector('.ui-ripple [data-part="wave"]'),
      ).toBeInTheDocument()

      rerender(<DemoSurface disabled />)
      expect(button.querySelector(".ui-ripple")).not.toBeInTheDocument()

      rerender(<DemoSurface disabled={false} />)
      expect(button.querySelector(".ui-ripple")).not.toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })

  test("has no accessibility violations", async () => {
    await a11y(<DemoSurface />)
  })
})
