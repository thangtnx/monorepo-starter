import { expect, modes, paint, test } from "./fixtures"

test.describe("Table", () => {
  test("renders semantic table structure and right-aligns numeric cells", async ({
    openStory,
    page,
  }) => {
    await openStory("components-table--basic")
    const table = page.getByRole("table", { name: "Recent workspace invoices" })
    await expect(table).toBeVisible()

    const numericCell = table.getByRole("cell", { name: "$120.00" })
    await expect(numericCell).toHaveCSS("text-align", "end")
  })

  test("variants look visually distinct and sizes grow row padding", async ({
    openStory,
    page,
  }) => {
    await openStory("components-table--variant")
    const tables = await page.locator("table.ui-table").all()
    expect(tables.length).toBeGreaterThan(1)
    const looks = await Promise.all(
      tables.map(async (table) => {
        const border = await table.evaluate(
          (el) => getComputedStyle(el).borderTopWidth,
        )
        const headerBg = await table
          .locator("thead")
          .evaluate((el) => getComputedStyle(el).backgroundColor)
        return `${border}|${headerBg}`
      }),
    )
    expect(new Set(looks).size).toBe(looks.length)

    await openStory("components-table--size")
    const cellHeights = await page
      .locator(".ui-table__cell")
      .evaluateAll((cells) =>
        cells.map((el) => el.getBoundingClientRect().height),
      )
    expect(Math.max(...cellHeights)).toBeGreaterThan(Math.min(...cellHeights))
  })

  test("applies striped background in light and dark modes", async ({
    openStory,
    page,
  }) => {
    for (const mode of modes) {
      await openStory("components-table--striped", mode)
      const firstRowBg = await paint(page.locator(".ui-table__body tr").nth(0))
      const secondRowBg = await paint(page.locator(".ui-table__body tr").nth(1))
      expect(secondRowBg).not.toBe(firstRowBg)
    }
  })
})
