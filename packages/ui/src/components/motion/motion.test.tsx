import { act, fireEvent } from "@testing-library/react"
import { a11y, render, screen } from "#test"
import { Collapse, Fade, ScaleFade, Slide, SlideFade } from "."

describe("Motion components", () => {
  test("Fade switches data-state, sets inert when closed, and unmounts on transitionEnd", () => {
    const { rerender } = render(
      <Fade open={false} unmountOnExit>
        Hidden content
      </Fade>,
    )

    expect(screen.queryByText("Hidden content")).not.toBeInTheDocument()

    rerender(
      <Fade delay="20ms" duration="180ms" open unmountOnExit>
        Hidden content
      </Fade>,
    )
    const node = screen.getByText("Hidden content")
    expect(node).toHaveClass("ui-motion")
    expect(node).toHaveAttribute("data-preset", "fade")
    expect(node).toHaveAttribute("data-state", "open")
    expect(node).not.toHaveAttribute("inert")
    expect(node.style.getPropertyValue("--motion-enter-duration")).toBe("180ms")
    expect(node.style.getPropertyValue("--motion-exit-duration")).toBe("180ms")
    expect(node.style.getPropertyValue("--motion-enter-delay")).toBe("20ms")
    expect(node.style.getPropertyValue("--motion-exit-delay")).toBe("20ms")

    rerender(
      <Fade
        delay={{ enter: "10ms", exit: "40ms" }}
        duration={{ enter: "250ms", exit: "120ms" }}
        open={false}
        unmountOnExit
      >
        Hidden content
      </Fade>,
    )
    expect(node).toHaveAttribute("data-state", "closed")
    expect(node).toHaveAttribute("inert")
    expect(node.style.getPropertyValue("--motion-enter-duration")).toBe("250ms")
    expect(node.style.getPropertyValue("--motion-exit-duration")).toBe("120ms")
    expect(node.style.getPropertyValue("--motion-enter-delay")).toBe("10ms")
    expect(node.style.getPropertyValue("--motion-exit-delay")).toBe("40ms")

    fireEvent.transitionEnd(node)
    expect(screen.queryByText("Hidden content")).not.toBeInTheDocument()
  })

  test("unmountOnExit falls back to a timeout when no transitionEnd fires", () => {
    vi.useFakeTimers()
    try {
      const { rerender } = render(
        <Slide open placement="bottom" unmountOnExit>
          Sliding sheet
        </Slide>,
      )
      const slide = screen.getByText("Sliding sheet")
      expect(slide).toHaveAttribute("data-state", "open")

      rerender(
        <Slide open={false} placement="bottom" unmountOnExit>
          Sliding sheet
        </Slide>,
      )
      expect(slide).toHaveAttribute("data-state", "closed")
      expect(slide).toHaveAttribute("inert")

      act(() => {
        vi.advanceTimersByTime(650)
      })
      expect(screen.queryByText("Sliding sheet")).not.toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })

  test("ScaleFade and SlideFade apply scale and offset CSS variables", () => {
    render(
      <>
        <ScaleFade initialScale={0.8} open>
          Scaled
        </ScaleFade>
        <SlideFade offsetX="12px" offsetY="-8px" open={false}>
          Slid
        </SlideFade>
      </>,
    )

    const scaled = screen.getByText("Scaled")
    expect(scaled).toHaveAttribute("data-preset", "scale-fade")
    expect(scaled).toHaveAttribute("data-state", "open")
    expect(scaled.style.getPropertyValue("--motion-scale")).toBe("0.8")

    const slid = screen.getByText("Slid")
    expect(slid).toHaveAttribute("data-preset", "slide-fade")
    expect(slid).toHaveAttribute("data-state", "closed")
    expect(slid).toHaveAttribute("inert")
    expect(slid.style.getPropertyValue("--motion-x")).toBe("12px")
    expect(slid.style.getPropertyValue("--motion-y")).toBe("-8px")
  })

  test("Collapse wraps inner content and keeps startingHeight previews interactive", () => {
    render(
      <>
        <Collapse open={false}>Collapsed fully</Collapse>
        <Collapse animateOpacity={false} open={false} startingHeight="2rem">
          Collapsed body
        </Collapse>
      </>,
    )

    const fullInner = screen.getByText("Collapsed fully")
    expect(fullInner).toHaveAttribute("data-part", "collapse-inner")
    expect(fullInner.parentElement).toHaveAttribute("inert")

    const previewInner = screen.getByText("Collapsed body")
    expect(previewInner).toHaveAttribute("data-part", "collapse-inner")
    const collapse = previewInner.parentElement!
    expect(collapse).toHaveAttribute("data-preset", "collapse")
    expect(collapse).toHaveAttribute("data-animate-opacity", "false")
    expect(collapse).not.toHaveAttribute("inert")
    expect(collapse.style.getPropertyValue("--motion-start-height")).toBe(
      "2rem",
    )
  })

  test("has no accessibility violations", async () => {
    await a11y(
      <Fade open>
        <span>Transition content</span>
      </Fade>,
    )
  })
})
