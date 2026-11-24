import { a11y, render, screen } from "#test"
import { EmptyState } from "./index"

describe("empty-state", () => {
  test("renders and customizes compound content and actions", async () => {
    const create = vi.fn()
    const { user } = render(
      <EmptyState.Root
        size="lg"
        actions={
          <button type="button" onClick={create}>
            Add file
          </button>
        }
        description="Add a file to get started."
        indicator={<span aria-hidden="true">0</span>}
        title="No files"
        titleProps={{ id: "empty-title" }}
      >
        <a href="/help">File help</a>
      </EmptyState.Root>,
    )
    expect(
      screen.getByRole("heading", { name: "No files", level: 3 }),
    ).toHaveAttribute("id", "empty-title")
    expect(screen.getByRole("link", { name: "File help" })).toBeVisible()
    await user.click(screen.getByRole("button", { name: "Add file" }))
    expect(create).toHaveBeenCalledOnce()
  })

  test("has no accessibility violations", async () => {
    await a11y(
      <EmptyState.Root>
        <EmptyState.Content>
          <EmptyState.Title>No drafts</EmptyState.Title>
          <EmptyState.Description>
            Drafts will appear here.
          </EmptyState.Description>
        </EmptyState.Content>
      </EmptyState.Root>,
    )
  })

  test("a custom title replaces the generated heading and keeps the description", () => {
    render(
      <EmptyState.Root
        description="Upload a file to get started."
        title="No files"
      >
        <EmptyState.Title>Nothing here</EmptyState.Title>
      </EmptyState.Root>,
    )
    const title = screen.getByRole("heading", {
      name: "Nothing here",
      level: 3,
    })
    expect(screen.getAllByRole("heading")).toHaveLength(1)
    expect(title.parentElement).toContainElement(
      screen.getByText("Upload a file to get started."),
    )
  })

  test("custom content, indicator, description and actions replace their generated parts", () => {
    const { rerender } = render(
      <EmptyState.Root
        actions="Generated actions"
        description="Generated description"
        indicator="Generated indicator"
        title="No files"
      >
        <EmptyState.Description>Custom description</EmptyState.Description>
        <EmptyState.Indicator>Custom indicator</EmptyState.Indicator>
        <EmptyState.Actions>Custom actions</EmptyState.Actions>
      </EmptyState.Root>,
    )
    expect(screen.queryByText(/^Generated /)).not.toBeInTheDocument()
    expect(screen.getByText("Custom description")).toBeVisible()
    expect(screen.getByText("Custom indicator")).toBeVisible()
    expect(screen.getByText("Custom actions")).toBeVisible()
    rerender(
      <EmptyState.Root title="No files">
        <EmptyState.Content>Custom content</EmptyState.Content>
      </EmptyState.Root>,
    )
    expect(screen.queryByRole("heading")).not.toBeInTheDocument()
    expect(screen.getByText("Custom content")).toBeVisible()
  })
})
