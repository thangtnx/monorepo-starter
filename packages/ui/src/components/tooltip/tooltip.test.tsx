import { act, fireEvent } from "@testing-library/react"
import { a11y, render, screen } from "#test"
import { Button } from "../button"
import { Tooltip } from "./index"

describe("<Tooltip />", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  test("shows on pointer enter after delay, hides on leave, and opens on focus", () => {
    vi.useFakeTimers()
    render(
      <Tooltip label="Copy item link" openDelay={150}>
        <Button>Copy</Button>
      </Tooltip>,
    )

    const button = screen.getByRole("button", { name: "Copy" })
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()

    fireEvent.pointerEnter(button)
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(150)
    })
    const tip = screen.getByRole("tooltip")
    expect(tip).toHaveTextContent("Copy item link")
    expect(button).toHaveAttribute("aria-describedby", tip.id)

    fireEvent.pointerLeave(button)
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
    expect(button).not.toHaveAttribute("aria-describedby")

    fireEvent.focus(button)
    expect(screen.getByRole("tooltip")).toBeInTheDocument()
    fireEvent.keyDown(document, { key: "Escape" })
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
  })

  test("suppresses display when disabled", () => {
    render(
      <Tooltip disabled label="Hidden help">
        <Button>Target</Button>
      </Tooltip>,
    )

    const button = screen.getByRole("button", { name: "Target" })
    fireEvent.focus(button)
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument()
  })

  test("has no accessibility violations when open", async () => {
    const { container } = render(
      <Tooltip defaultOpen label="Helpful summary">
        <Button>Info</Button>
      </Tooltip>,
    )
    await a11y(container)
  })
})
