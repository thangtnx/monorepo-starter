import { within } from "@testing-library/react"
import { a11y, screen } from "#test"
import { Table } from "./index"

describe("<Table />", () => {
  test("renders semantic table parts, numeric columns, and styling attributes", async () => {
    const ui = (
      <Table.ScrollArea>
        <Table.Root
          colorScheme="primary"
          size="sm"
          variant="outline"
          highlightOnHover
          stickyHeader
          striped
          withBorder
          withColumnBorders
        >
          <Table.Caption>Monthly invoices</Table.Caption>
          <Table.Header>
            <Table.Row>
              <Table.Head>Account</Table.Head>
              <Table.Head numeric>Amount</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Acme</Table.Cell>
              <Table.Cell numeric>120.00</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Horizon</Table.Cell>
              <Table.Cell numeric>240.00</Table.Cell>
            </Table.Row>
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.Cell>Total</Table.Cell>
              <Table.Cell numeric>360.00</Table.Cell>
            </Table.Row>
          </Table.Footer>
        </Table.Root>
      </Table.ScrollArea>
    )

    await a11y(ui)
    const table = screen.getByRole("table", { name: "Monthly invoices" })
    expect(table).toHaveClass("ui-table")
    expect(table.parentElement).toHaveClass("ui-table__scrollArea")
    expect(table).toHaveAttribute("data-variant", "outline")
    expect(table).toHaveAttribute("data-size", "sm")
    expect(table).toHaveAttribute("data-scheme", "primary")
    expect(table).toHaveAttribute("data-striped", "true")
    expect(table).toHaveAttribute("data-highlight-on-hover", "true")
    expect(table).toHaveAttribute("data-sticky-header", "true")
    expect(table).toHaveAttribute("data-with-border", "true")
    expect(table).toHaveAttribute("data-with-column-borders", "true")

    const amountHead = within(table).getByRole("columnheader", {
      name: "Amount",
    })
    const amountCell = within(table).getByRole("cell", { name: "120.00" })
    expect(amountHead).toHaveAttribute("data-numeric", "true")
    expect(amountCell).toHaveAttribute("data-numeric", "true")
    expect(
      within(table).getByRole("columnheader", { name: "Account" }),
    ).not.toHaveAttribute("data-numeric")
  })
})
