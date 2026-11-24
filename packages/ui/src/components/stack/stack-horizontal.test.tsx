import { a11y, render, screen } from "#test"
import { HStack } from "./stack-horizontal"

describe("<HStack />", () => {
  test("sets direction and forwards spacing", async () => {
    const { container } = render(
      <HStack aria-label="Actions" gap="2" role="group">
        <button type="button">Save</button>
      </HStack>,
    )

    const stack = screen.getByRole("group", { name: "Actions" })
    expect(stack).toHaveAttribute("data-direction", "row")
    expect(stack).toHaveAttribute("data-gap", "2")
    await a11y(container)
  })
})
