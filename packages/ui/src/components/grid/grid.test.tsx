import { a11y, render, screen } from "#test"
import { Grid } from "./grid"
import { GridItem } from "./grid-item"

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

  test("supports template tracks, named areas, minChildWidth, and flow", () => {
    const { rerender } = render(
      <Grid
        aria-label="Layout"
        autoColumns="minmax(0, 1fr)"
        autoRows="auto"
        flow="dense"
        role="group"
        templateAreas='"header header" "nav main"'
        templateColumns="14rem 1fr"
        templateRows="auto 1fr"
      >
        <GridItem area="header" colSpan="full" rowSpan={2}>
          Header
        </GridItem>
        <GridItem colStart={2} rowEnd={4} rowStart={2}>
          Main
        </GridItem>
      </Grid>,
    )

    const grid = screen.getByRole("group", { name: "Layout" })
    expect(grid).not.toHaveAttribute("data-columns")
    expect(grid).toHaveAttribute("data-flow", "dense")
    expect(grid).toHaveAttribute("data-template-columns", "")
    expect(grid).toHaveAttribute("data-template-rows", "")
    expect(grid).toHaveAttribute("data-template-areas", "")
    expect(grid).toHaveAttribute("data-auto-columns", "")
    expect(grid).toHaveAttribute("data-auto-rows", "")
    expect(grid.style.getPropertyValue("--grid-template-columns")).toBe(
      "14rem 1fr",
    )
    expect(grid.style.getPropertyValue("--grid-template-rows")).toBe("auto 1fr")
    expect(grid.style.getPropertyValue("--grid-template-areas")).toBe(
      `"header header" "nav main"`,
    )

    const header = screen.getByText("Header")
    expect(header).toHaveClass("ui-grid-item")
    expect(header).toHaveAttribute("data-area", "")
    expect(header).toHaveAttribute("data-column", "")
    expect(header).toHaveAttribute("data-row", "")
    expect(header.style.getPropertyValue("--grid-area")).toBe("header")
    expect(header.style.getPropertyValue("--grid-column")).toBe("1 / -1")
    expect(header.style.getPropertyValue("--grid-row")).toBe("span 2")

    const main = screen.getByText("Main")
    expect(main.style.getPropertyValue("--grid-column")).toBe("2")
    expect(main.style.getPropertyValue("--grid-row")).toBe("2 / 4")

    rerender(
      <Grid aria-label="Cards" minChildWidth="12rem" role="group">
        Card
      </Grid>,
    )
    expect(
      screen
        .getByRole("group", { name: "Cards" })
        .style.getPropertyValue("--grid-template-columns"),
    ).toBe("repeat(auto-fit, minmax(min(12rem, 100%), 1fr))")
  })

  test("has no accessibility violations", async () => {
    await a11y(
      <Grid columns={2}>
        <button type="button">Result</button>
      </Grid>,
    )
  })
})
