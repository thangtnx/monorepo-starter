import { a11y, render, screen } from "#test"
import { Check, CircleAlert, Icon, TriangleAlert } from "../icon"
import { Alert } from "./index"

describe("alert", () => {
  test.each([
    ["info", "Information"],
    ["success", "Success"],
    ["warning", "Warning"],
    ["error", "Error"],
    ["danger", "Danger"],
    ["loading", "Loading"],
  ] as const)("renders a named default icon for %s", async (status, name) => {
    await a11y(
      <Alert.Root status={status}>
        <Alert.Title>Sync update</Alert.Title>
      </Alert.Root>,
    )
    expect(
      screen.getByRole("img", { name }).querySelector(".lucide"),
    ).toBeInTheDocument()
  })

  test.each(["info", "success", "warning", "danger", "error"] as const)(
    "announces %s with the appropriate role",
    (status) => {
      render(
        <Alert.Root variant="surface" status={status}>
          <Alert.Icon aria-hidden>!</Alert.Icon>
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

  test("replaces the default status icon with a named loading indicator", async () => {
    await a11y(
      <Alert.Root aria-busy="true">
        <Alert.Loading loadingScheme="dots" />
        <Alert.Title>Syncing</Alert.Title>
      </Alert.Root>,
    )
    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true")
    expect(screen.getByRole("img", { name: "Loading" })).toBeInTheDocument()
    expect(
      screen.queryByRole("img", { name: "Information" }),
    ).not.toBeInTheDocument()
  })

  test("renders the active status slot and announces one custom name", async () => {
    const statusIcons = {
      success: <Icon as={Check} aria-label="Available" />,
      warning: <Icon as={TriangleAlert} aria-label="Pending" />,
    }
    const { container, rerender } = render(
      <Alert.Root status="warning" statusIcons={statusIcons}>
        <Alert.Title>Sync paused</Alert.Title>
      </Alert.Root>,
    )
    await a11y(container)
    expect(screen.getByRole("img", { name: "Pending" })).toBeInTheDocument()
    expect(screen.getAllByRole("img")).toHaveLength(1)
    rerender(
      <Alert.Root status="success" statusIcons={statusIcons}>
        <Alert.Icon>
          <Icon as={CircleAlert} aria-label="Custom" />
        </Alert.Icon>
        <Alert.Title>Sync ready</Alert.Title>
      </Alert.Root>,
    )
    expect(screen.getByRole("img", { name: "Custom" })).toBeInTheDocument()
    expect(screen.getAllByRole("img")).toHaveLength(1)
  })

  test("announces loading automatically and allows an explicit glyph", () => {
    render(
      <Alert.Root status="loading">
        <Alert.Icon as={Check} />
        <Alert.Title>Syncing</Alert.Title>
      </Alert.Root>,
    )

    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true")
    const icon = screen.getByRole("img", { name: "Loading" })
    expect(icon).not.toHaveAttribute("aria-hidden")
    expect(icon.querySelector("svg.lucide-check")).toBeInTheDocument()
  })

  test("omits the image role on an explicitly hidden status icon", () => {
    const { container } = render(
      <Alert.Root status="error" iconProps={{ "aria-hidden": true }} />,
    )
    const icon = container.querySelector(".ui-alert-icon")
    expect(icon).toHaveAttribute("aria-hidden", "true")
    expect(icon).not.toHaveAttribute("role")
  })

  test.each([
    ["danger", "Danger", "octagon-alert"],
    ["error", "Error", "octagon-alert"],
    ["success", "Success", "circle-check-big"],
  ] as const)("uses the expected %s glyph", (status, label, glyph) => {
    render(<Alert.Root status={status} />)
    expect(
      screen.getByRole("img", { name: label }).querySelector("svg"),
    ).toHaveClass(`lucide-${glyph}`)
  })
})
