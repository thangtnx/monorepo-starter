import { within } from "@testing-library/react"
import { a11y, render, screen } from "#test"
import { CircleAlert, Icon } from "../icon"
import { Notice } from "./index"

describe("notice", () => {
  test("announces a custom icon once inside the notice", async () => {
    await a11y(
      <Notice.Item
        icon={<Icon as={CircleAlert} aria-label="Network error" />}
        status="error"
        title="Upload failed"
      />,
    )
    const alert = within(screen.getByRole("alert"))
    expect(
      alert.getByRole("img", { name: "Network error" }),
    ).toBeInTheDocument()
    expect(alert.getAllByRole("img")).toHaveLength(1)
  })

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
    expect(
      within(status).getByRole("img", { name: "Success" }),
    ).toBeInTheDocument()
    expect(close.querySelector(".lucide")).toBeInTheDocument()
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
    await user.tab()
    await user.tab()
    expect(
      screen.getByRole("button", { name: "Dismiss notification" }),
    ).toHaveFocus()
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
    const { rerender } = render(
      <Notice.Item
        loadingScheme="rings"
        status="error"
        statusIcons={statusIcons}
        title="Upload pending"
      />,
    )
    const alert = screen.getByRole("alert")
    expect(alert).toHaveAttribute("aria-busy", "true")
    expect(
      within(alert).getByRole("img", { name: "Loading" }),
    ).toBeInTheDocument()
    expect(alert.querySelector("svg.ui-alert-loading")).toHaveAttribute(
      "viewBox",
      "0 0 45 45",
    )
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
