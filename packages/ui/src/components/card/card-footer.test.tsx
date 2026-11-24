import { a11y, render, screen } from "#test"
import { CardFooter } from "./card-footer"

describe("<CardFooter />", () => {
  test("styles the container and preserves the child semantics", async () => {
    const { container } = render(
      <CardFooter>
        <a href="/messages">Read messages</a>
      </CardFooter>,
    )

    expect(
      screen.getByRole("link", { name: "Read messages" }).parentElement,
    ).toHaveClass("ui-card-footer")
    await a11y(container)
  })
})
