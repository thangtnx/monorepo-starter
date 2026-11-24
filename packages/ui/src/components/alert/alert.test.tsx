import { a11y, render, screen } from "#test"
import { Alert } from "./index"

describe("alert", () => {
  test.each(["info", "success", "warning", "danger", "error"] as const)(
    "announces %s with the appropriate role",
    (status) => {
      render(
        <Alert.Root variant="surface" status={status}>
          <Alert.Icon>!</Alert.Icon>
          <Alert.Title>Sync update</Alert.Title>
          <Alert.Description>Your files are up to date.</Alert.Description>
        </Alert.Root>,
      )
      const alert = screen.getByRole(
        status === "danger" || status === "error" ? "alert" : "status",
      )
      expect(alert).toHaveAttribute("data-variant", "surface")
      expect(alert).toHaveAttribute(
        "data-scheme",
        status === "error" ? "danger" : status,
      )
      expect(alert).toHaveTextContent("Sync update")
      expect(screen.getByText("!")).toHaveAttribute("aria-hidden", "true")
    },
  )

  test("exposes the loading message without announcing the decorative indicator", async () => {
    await a11y(
      <Alert.Root aria-busy="true">
        <Alert.Loading loadingScheme="dots" />
        <Alert.Title>Syncing</Alert.Title>
      </Alert.Root>,
    )
    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true")
    expect(screen.queryByRole("img")).not.toBeInTheDocument()
  })

  test("renders the active status slot and lets an explicit icon take precedence", () => {
    const statusIcons = { success: "Available", warning: "Pending" }
    const { rerender } = render(
      <Alert.Root status="warning" statusIcons={statusIcons}>
        <Alert.Title>Sync paused</Alert.Title>
      </Alert.Root>,
    )
    expect(screen.getByText("Pending")).toHaveAttribute("aria-hidden", "true")
    expect(screen.queryByText("Available")).not.toBeInTheDocument()
    rerender(
      <Alert.Root status="success" statusIcons={statusIcons}>
        <Alert.Icon>Custom</Alert.Icon>
        <Alert.Title>Sync ready</Alert.Title>
      </Alert.Root>,
    )
    expect(screen.getByText("Custom")).toBeInTheDocument()
    expect(screen.queryByText("Available")).not.toBeInTheDocument()
  })
})
