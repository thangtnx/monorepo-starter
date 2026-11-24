import { a11y, render, screen } from "#test"
import { Heading } from "./heading"

describe("<Heading />", () => {
  test("defaults to a level-two heading", () => {
    render(<Heading>Overview</Heading>)

    expect(
      screen.getByRole("heading", { name: "Overview", level: 2 }),
    ).toHaveAttribute("data-variant", "h2")
  })

  test("supports all six levels and independent visual variants", () => {
    render(
      <>
        <Heading as="h1" variant="display">
          Title
        </Heading>
        <Heading as="h2">Section</Heading>
        <Heading as="h3">Subsection</Heading>
        <Heading as="h4">Details</Heading>
        <Heading as="h5">Notes</Heading>
        <Heading as="h6">Sources</Heading>
      </>,
    )

    expect(
      screen.getByRole("heading", { name: "Title", level: 1 }),
    ).toHaveAttribute("data-variant", "display")
    expect(
      screen.getAllByRole("heading").map((heading) => heading.tagName),
    ).toStrictEqual(["H1", "H2", "H3", "H4", "H5", "H6"])
  })

  test("has no accessibility violations", async () => {
    await a11y(<Heading as="h1">Overview</Heading>)
  })
})
