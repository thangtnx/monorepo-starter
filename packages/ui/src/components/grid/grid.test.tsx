import { a11y, render, screen } from "#test"
import { Grid } from "./grid"

describe("<Grid />", () => {
  test("defaults to one column", () => {
    render(
      <Grid aria-label="Results" role="group">
        Result
      </Grid>,
    )

    const grid = screen.getByRole("group", { name: "Results" })
    expect(grid).toHaveAttribute("data-columns", "1")
    expect(grid).toHaveAttribute("data-gap", "4")
  })

  test("maps column, gap, and alignment options to data attributes", () => {
    render(
      <Grid
        aria-label="Results"
        align="center"
        columns={3}
        gap="2"
        justify="end"
        role="group"
      >
        <button type="button">Result</button>
      </Grid>,
    )

    const grid = screen.getByRole("group", { name: "Results" })
    expect(grid).toContainElement(
      screen.getByRole("button", { name: "Result" }),
    )
    expect(grid).toHaveAttribute("data-columns", "3")
    expect(grid).toHaveAttribute("data-gap", "2")
    expect(grid).toHaveAttribute("data-align", "center")
    expect(grid).toHaveAttribute("data-justify", "end")
    expect(grid).not.toHaveAttribute("style")
  })

  test("has no accessibility violations", async () => {
    await a11y(
      <Grid columns={2}>
        <button type="button">Result</button>
      </Grid>,
    )
  })
})
