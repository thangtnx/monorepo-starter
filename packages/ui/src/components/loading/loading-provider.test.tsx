import { act, fireEvent, waitFor, within } from "@testing-library/react"
import { useEffect, useLayoutEffect } from "react"
import { a11y, render, screen } from "#test"
import { createCss } from "../../core"
import { theme } from "../../theme"
import { LoadingBackground, LoadingProvider, useLoading } from "./index"
import { loadingLayerStyle } from "./loading-layer.style"

function Controls() {
  const { background, page, screen } = useLoading()
  return (
    <>
      <button
        type="button"
        onClick={() => screen.start({ message: "Preparing workspace" })}
      >
        Start screen
      </button>
      <button
        type="button"
        onClick={() => page.start({ message: "Loading records" })}
      >
        Start page
      </button>
      <button
        type="button"
        onClick={() => background.start({ message: "Syncing records" })}
      >
        Start sync
      </button>
      <button
        type="button"
        onClick={() =>
          background.update({
            loadingScheme: "grid",
            message: "Syncing changes",
          })
        }
      >
        Update sync
      </button>
    </>
  )
}

function setup() {
  let controls: ReturnType<typeof useLoading>
  function CaptureControls() {
    const current = useLoading()
    useEffect(() => {
      controls = current
    }, [current])
    return <Controls />
  }
  const result = render(
    <LoadingProvider>
      <CaptureControls />
    </LoadingProvider>,
  )
  return {
    ...result,
    get controls() {
      return controls
    },
  }
}

describe("loading provider", () => {
  test.each([
    ["screen", "Start screen", "Preparing workspace"],
    ["page", "Start page", "Loading records"],
  ] as const)(
    "portals %s, makes content busy and restores focus",
    async (mode, trigger, message) => {
      const { container, controls, user } = setup()
      const button = screen.getByRole("button", { name: trigger })
      await user.click(button)
      const dialog = screen.getByRole("dialog", { name: message })
      expect(dialog.parentElement).toBe(document.body)
      expect(container).not.toContainElement(dialog)
      expect(dialog).toHaveFocus()
      expect(container.firstElementChild).toHaveAttribute("aria-busy", "true")
      expect(container.firstElementChild).toHaveAttribute("inert")
      expect(within(dialog).getByRole("status")).toHaveTextContent(message)
      act(() => controls[mode].finish())
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
      expect(container.firstElementChild).toHaveAttribute("aria-busy", "false")
      expect(container.firstElementChild).not.toHaveAttribute("inert")
      await waitFor(() => expect(button).toHaveFocus())
    },
  )

  test("counts concurrent background operations, updates their message and allows a forced reset", async () => {
    const { container, controls, user } = setup()
    const start = screen.getByRole("button", { name: "Start sync" })
    await user.click(start)
    expect(start).toHaveFocus()
    await user.click(start)
    await user.click(screen.getByRole("button", { name: "Update sync" }))
    const status = screen.getByRole("status")
    expect(status).toHaveTextContent("Syncing changes")
    expect(status.querySelector(".ui-loading-grid")).toBeInTheDocument()
    expect(container.firstElementChild).toHaveAttribute("aria-busy", "false")
    expect(container.firstElementChild).not.toHaveAttribute("inert")
    act(() => controls.background.finish())
    expect(status).toBeInTheDocument()
    act(() => controls.background.force({}))
    expect(status).not.toBeInTheDocument()
  })

  test("restores content focus when it was lost before the modal opened", async () => {
    const { controls } = setup()
    const trigger = screen.getByRole("button", { name: "Start page" })
    trigger.focus()
    act(() => {
      trigger.blur()
      controls.page.start()
    })
    expect(screen.getByRole("dialog")).toHaveFocus()
    act(() => controls.page.finish())
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  test("mounts the portal in the same commit as the inert region", () => {
    const checkCommit = vi.fn()
    function CheckCommit() {
      useLayoutEffect(() => {
        checkCommit(
          document.querySelector(".ui-loading-region")?.hasAttribute("inert"),
          document.body.querySelector("dialog")?.parentElement,
        )
      }, [])
      return null
    }

    render(
      <LoadingProvider page={{ loadingCount: 1 }}>
        <CheckCommit />
      </LoadingProvider>,
    )
    expect(checkCommit).toHaveBeenCalledWith(true, document.body)
  })

  test("announces a fallback label without displaying a message", () => {
    render(<LoadingBackground />)
    const status = screen.getByRole("status")
    expect(within(status).getByText("Loading")).toHaveClass(
      "ui-visually-hidden",
    )
  })

  test("uses the small font token for background messages", () => {
    const css = createCss(theme, { "loading-layer": loadingLayerStyle })
    expect(css).toMatch(
      /\.ui-loading-layer:not\(dialog\) \.ui-loading-message\s*\{[^}]*font-size: var\(--font-sizes-sm\)/,
    )
  })

  test.each(["screen", "page"] as const)(
    "keeps the %s dialog open when Escape requests dismissal",
    (mode) => {
      const { controls } = setup()
      act(() => controls[mode].start())
      const dialog = screen.getByRole("dialog")
      const cancel = new Event("cancel", { cancelable: true })
      fireEvent(dialog, cancel)
      expect(cancel.defaultPrevented).toBeTruthy()
      expect(dialog).toHaveAttribute("open")
    },
  )

  test("applies the reduced-motion duration and iteration limit to the layer entrance", () => {
    render(<LoadingBackground />)
    expect(screen.getByRole("status").parentElement).toHaveAttribute(
      "data-enter",
    )
    const css = createCss(theme, { "loading-layer": loadingLayerStyle })
    expect(css).toMatch(
      /\.ui-loading-layer\[data-enter\]\s*\{[^}]*animation: ui-feedback-fade-in/,
    )
    expect(css).toMatch(
      /prefers-reduced-motion: reduce[^}]*\*, \*::before, \*::after\s*\{[^}]*animation-duration: 1ms !important[^}]*animation-iteration-count: 1 !important/,
    )
  })

  test("shows screen ahead of page and restores page when screen finishes", () => {
    const { container, controls } = setup()
    act(() => controls.screen.start({ message: "Preparing workspace" }))
    act(() => controls.page.start({ message: "Loading records" }))
    const dialog = screen.getByRole("dialog", { name: "Preparing workspace" })
    expect(dialog).toHaveAttribute("data-screen")
    expect(screen.getAllByRole("dialog")).toHaveLength(1)

    act(() => controls.screen.finish())
    expect(screen.getByRole("dialog", { name: "Loading records" })).toBe(dialog)
    expect(dialog).not.toHaveAttribute("data-screen")
    expect(dialog).toHaveFocus()
    expect(container.firstElementChild).toHaveAttribute("inert")

    act(() => controls.page.finish())
    expect(dialog).not.toBeInTheDocument()
    expect(container.firstElementChild).not.toHaveAttribute("inert")
  })

  test("finishes a timed operation", () => {
    vi.useFakeTimers()
    try {
      const { controls } = setup()
      act(() => controls.background.start({ duration: 50 }))
      expect(screen.getByRole("status")).toBeInTheDocument()
      act(() => vi.advanceTimersByTime(50))
      expect(screen.queryByRole("status")).not.toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })

  test.each(["screen", "page", "background"] as const)(
    "starts with an accessible %s loader",
    async (mode) => {
      render(
        <LoadingProvider
          {...{ [mode]: { loadingCount: 1, message: "Loading records" } }}
        >
          <p>Records</p>
        </LoadingProvider>,
      )
      await a11y(document.body, { rules: { region: { enabled: false } } })
      expect(screen.getByRole("status")).toHaveTextContent("Loading records")
    },
  )
})
