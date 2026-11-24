import { a11y, render, screen } from "#test"
import { Stack } from "./stack"

describe("<Stack />", () => {
  test("defaults to a vertical stack with a four-step gap", () => {
    render(
      <Stack aria-label="Options" role="group">
        Option
      </Stack>,
    )

    const stack = screen.getByRole("group", { name: "Options" })
    expect(stack).toHaveAttribute("data-direction", "column")
    expect(stack).toHaveAttribute("data-gap", "4")
  })

  test("maps layout props to data attributes", () => {
    render(
      <Stack
        aria-label="Actions"
        align="center"
        direction="row"
        gap="0"
        justify="space-between"
        role="group"
      >
        <button type="button">Save</button>
      </Stack>,
    )

    const stack = screen.getByRole("group", { name: "Actions" })
    expect(stack).toContainElement(screen.getByRole("button", { name: "Save" }))
    expect(stack).toHaveAttribute("data-direction", "row")
    expect(stack).toHaveAttribute("data-gap", "0")
    expect(stack).toHaveAttribute("data-align", "center")
    expect(stack).toHaveAttribute("data-justify", "space-between")
    expect(stack).not.toHaveAttribute("style")
  })

  test("has no accessibility violations", async () => {
    await a11y(
      <Stack>
        <button type="button">Save</button>
      </Stack>,
    )
  })
})
