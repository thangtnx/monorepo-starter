import { a11y, render, screen } from "#test"
import { VisuallyHidden } from "./visually-hidden"

describe("<VisuallyHidden />", () => {
  test("keeps its text in the accessible name", () => {
    render(
      <button type="button">
        <svg aria-hidden="true" />
        <VisuallyHidden>Close</VisuallyHidden>
      </button>,
    )

    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument()
    expect(screen.getByText("Close")).toHaveClass("ui-visually-hidden")
  })

  test("has no accessibility violations", async () => {
    await a11y(<VisuallyHidden>Hidden note</VisuallyHidden>)
  })
})
