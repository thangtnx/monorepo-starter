import { a11y, render, screen } from "#test"
import { Notice } from "./index"

describe("notice", () => {
  test.each(["{Enter}", "[Space]"])(
    "dismisses a closable item with %s using the default close button",
    async (key) => {
      const onClose = vi.fn()
      const { user } = render(
        <Notice.Item closable title="File saved" onClose={onClose} />,
      )

      await user.tab()
      expect(
        screen.getByRole("button", { name: "Dismiss notification" }),
      ).toHaveFocus()
      await user.keyboard(key)
      expect(onClose).toHaveBeenCalledOnce()
    },
  )

  test("groups visual items in a named region and leaves dismissal under caller control", async () => {
    const onClose = vi.fn()
    const { container, user } = render(
      <Notice.Root aria-label="Workspace updates">
        <Notice.Item
          closable
          closeStrategies={["button", "click"]}
          status="success"
          title="File saved"
          onClose={onClose}
        />
      </Notice.Root>,
    )
    const region = screen.getByRole("region", { name: "Workspace updates" })
    const status = screen.getByRole("status")
    const close = screen.getByRole("button", {
      name: "Dismiss notification",
    })
    expect(region).toContainElement(status)
    expect(status).toContainElement(close)
    await a11y(container)
    await user.click(close)
    expect(onClose).toHaveBeenCalledOnce()
    expect(status).toHaveTextContent("File saved")
    await user.click(screen.getByText("File saved"))
    expect(onClose).toHaveBeenCalledTimes(2)
    expect(status).toBeInTheDocument()
  })

  test("honors closable and ignores interactive content during click dismissal", async () => {
    const onClose = vi.fn()
    const { rerender, user } = render(
      <Notice.Item
        closable
        closeStrategies={["click"]}
        title="Sync complete"
        onClose={onClose}
      >
        <button type="button">View details</button>
      </Notice.Item>,
    )
    expect(screen.getAllByRole("button")).toHaveLength(1)
    await user.click(screen.getByRole("button", { name: "View details" }))
    expect(onClose).not.toHaveBeenCalled()
    await user.click(screen.getByText("Sync complete"))
    expect(onClose).toHaveBeenCalledOnce()

    rerender(
      <Notice.Item
        closable={false}
        closeStrategies={["button", "click"]}
        title="Sync complete"
        onClose={onClose}
      />,
    )
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
    await user.click(screen.getByText("Sync complete"))
    expect(onClose).toHaveBeenCalledOnce()
  })

  test("the close button and item handlers can cancel dismissal", async () => {
    const onClose = vi.fn()
    const { user } = render(
      <Notice.Item
        closable
        closeStrategies={["button", "click"]}
        title="Sync pending"
        closeButtonProps={{
          "aria-label": "Keep alert",
          children: "Keep",
          onClick: (event) => event.preventDefault(),
        }}
        onClick={(event) => event.preventDefault()}
        onClose={onClose}
      />,
    )
    const close = screen.getByRole("button", { name: "Keep alert" })
    expect(close).toHaveTextContent("Keep")
    await user.click(close)
    await user.click(screen.getByText("Sync pending"))
    expect(onClose).not.toHaveBeenCalled()
  })

  test("loads in the selected scheme and toggles the status icon slot", () => {
    const statusIcons = {
      error: <span>Offline</span>,
      success: <span>Online</span>,
    }
    const { container, rerender } = render(
      <Notice.Item
        loadingScheme="rings"
        status="error"
        statusIcons={statusIcons}
        title="Upload pending"
      />,
    )
    expect(screen.getByRole("alert")).toHaveAttribute("aria-busy", "true")
    expect(
      container.querySelector("[data-indicator='rings']"),
    ).toBeInTheDocument()
    expect(screen.queryByText("Offline")).not.toBeInTheDocument()
    rerender(
      <Notice.Item
        status="error"
        statusIcons={statusIcons}
        title="Upload failed"
      />,
    )
    expect(screen.getByText("Offline")).toBeInTheDocument()
    expect(screen.queryByText("Online")).not.toBeInTheDocument()
    rerender(
      <Notice.Item
        status="error"
        statusIcons={statusIcons}
        title="Upload failed"
        withIcon={false}
      />,
    )
    expect(screen.queryByText("Offline")).not.toBeInTheDocument()
  })
})
