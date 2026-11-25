import { act, fireEvent } from "@testing-library/react"
import { a11y, render, screen } from "#test"
import { createToastStore, Toaster } from "./index"

describe("<Toaster /> & toast", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  test("auto-dismisses info/success after 5s, pauses on hover, and keeps error persistent", () => {
    vi.useFakeTimers()
    const store = createToastStore()
    render(<Toaster store={store} />)

    act(() => {
      store.success({ description: "Changes synced.", title: "Saved" })
      store.error({ description: "Connection refused.", title: "Failed" })
    })

    expect(screen.getByText("Saved")).toBeInTheDocument()
    expect(screen.getByText("Failed")).toBeInTheDocument()

    const region = screen.getByRole("region", { name: "Notifications" })
    fireEvent.pointerEnter(region)
    act(() => {
      vi.advanceTimersByTime(6000)
    })
    // Paused while hovered.
    expect(screen.getByText("Saved")).toBeInTheDocument()

    fireEvent.pointerLeave(region)
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    // Auto-dismissed after resume; error remains persistent.
    expect(screen.queryByText("Saved")).not.toBeInTheDocument()
    expect(screen.getByText("Failed")).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole("button", { name: "Dismiss notification" }),
    )
    expect(screen.queryByText("Failed")).not.toBeInTheDocument()
  })

  test("caps visible stack at limit and updates existing toast", () => {
    const store = createToastStore()
    render(<Toaster limit={2} store={store} />)

    let id = ""
    act(() => {
      store.info({ title: "First" })
      store.info({ title: "Second" })
      id = store.loading({ title: "Uploading" })
    })

    expect(screen.queryByText("First")).not.toBeInTheDocument()
    expect(screen.getByText("Second")).toBeInTheDocument()
    expect(screen.getByText("Uploading")).toBeInTheDocument()

    act(() => {
      store.update(id, { status: "success", title: "Upload complete" })
    })
    expect(screen.getByText("Upload complete")).toBeInTheDocument()
  })

  test("has no accessibility violations with active toasts", async () => {
    const store = createToastStore()
    const { container } = render(<Toaster store={store} />)
    act(() => {
      store.info({ description: "Ready.", title: "Notice" })
    })
    await a11y(container)
  })
})
