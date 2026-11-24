import { a11y, render, screen } from "#test"
import { CardBody } from "./card-body"

describe("<CardBody />", () => {
  test("styles the container and preserves the child semantics", async () => {
    const { container } = render(
      <CardBody>
        <p>Three new messages.</p>
      </CardBody>,
    )

    expect(screen.getByRole("paragraph").parentElement).toHaveClass(
      "ui-card-body",
    )
    await a11y(container)
  })
})
