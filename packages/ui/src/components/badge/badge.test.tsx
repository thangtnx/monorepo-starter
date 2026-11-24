import { a11y, render, screen } from "#test"
import { Badge } from "./badge"

describe("<Badge />", () => {
  test("renders its text with the default style", () => {
    render(<Badge>Draft</Badge>)

    const badge = screen.getByText("Draft")

    expect(badge).toHaveClass("ui-badge")
    expect(badge).toHaveAttribute("data-variant", "subtle")
    expect(badge).toHaveAttribute("data-scheme", "neutral")
  })

  test("applies the given color scheme and variant", () => {
    render(
      <Badge colorScheme="success" variant="solid">
        Paid
      </Badge>,
    )

    expect(screen.getByText("Paid")).toHaveAttribute("data-scheme", "success")
    expect(screen.getByText("Paid")).toHaveAttribute("data-variant", "solid")
  })

  test("has no accessibility violations", async () => {
    await a11y(<Badge colorScheme="danger">Overdue</Badge>)
  })
})
