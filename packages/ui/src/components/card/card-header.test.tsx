import { a11y, render, screen } from "#test"
import { CardHeader } from "./card-header"

describe("<CardHeader />", () => {
  test("styles the container and preserves the child semantics", async () => {
    const { container } = render(
      <CardHeader>
        <h2>Summary</h2>
      </CardHeader>,
    )

    expect(
      screen.getByRole("heading", { name: "Summary" }).parentElement,
    ).toHaveClass("ui-card__header")
    await a11y(container)
  })
})
