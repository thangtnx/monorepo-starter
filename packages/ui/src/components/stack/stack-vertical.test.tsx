import { a11y, render, screen } from "#test"
import { VStack } from "./stack-vertical"

describe("<VStack />", () => {
  test("sets direction and forwards spacing", async () => {
    const { container } = render(
      <VStack aria-label="Actions" gap="2" role="group">
        <button type="button">Save</button>
      </VStack>,
    )

    const stack = screen.getByRole("group", { name: "Actions" })
    expect(stack).toHaveAttribute("data-direction", "column")
    expect(stack).toHaveAttribute("data-gap", "2")
    await a11y(container)
  })
})
