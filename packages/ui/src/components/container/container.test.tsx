import { a11y, render, screen } from "#test"
import { Container } from "./container"

describe("<Container />", () => {
  test("offers a default and a full-width preset", () => {
    render(
      <>
        <Container aria-label="Content" role="group">
          Content
        </Container>
        <Container
          className="example"
          size="full"
          aria-label="Wide content"
          role="group"
        >
          Wide content
        </Container>
      </>,
    )

    expect(screen.getByRole("group", { name: "Content" })).toHaveAttribute(
      "data-size",
      "lg",
    )
    const wide = screen.getByRole("group", { name: "Wide content" })
    expect(wide).toHaveAttribute("data-size", "full")
    expect(wide).toHaveClass("ui-container", "example")
  })

  test("has no accessibility violations", async () => {
    await a11y(
      <Container>
        <h1>Account details</h1>
      </Container>,
    )
  })
})
