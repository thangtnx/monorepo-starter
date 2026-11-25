import { expect, paint, test } from "./fixtures"

test.describe("Pagination", () => {
  test("navigates across pages via page, step, and edge buttons", async ({
    openStory,
    page,
  }) => {
    await openStory("components-pagination--edges")

    const pageFive = page.getByRole("button", { name: "Page 5", exact: true })
    await expect(pageFive).toHaveAttribute("aria-current", "page")

    await page.getByRole("button", { name: "Next page" }).click()
    await expect(
      page.getByRole("button", { name: "Page 6", exact: true }),
    ).toHaveAttribute("aria-current", "page")

    await page.getByRole("button", { name: "First page" }).click()
    await expect(
      page.getByRole("button", { name: "Page 1", exact: true }),
    ).toHaveAttribute("aria-current", "page")
    await expect(
      page.getByRole("button", { name: "First page" }),
    ).toBeDisabled()
    await expect(
      page.getByRole("button", { name: "Previous page" }),
    ).toBeDisabled()

    await page.getByRole("button", { name: "Last page" }).click()
    await expect(
      page.getByRole("button", { name: "Page 10", exact: true }),
    ).toHaveAttribute("aria-current", "page")
    await expect(page.getByRole("button", { name: "Next page" })).toBeDisabled()
    await expect(page.getByRole("button", { name: "Last page" })).toBeDisabled()
  })

  test("variants look distinct and sizes grow button height", async ({
    openStory,
    page,
  }) => {
    await openStory("components-pagination--variant")
    const activeButtons = await page.locator('[aria-current="page"]').all()
    const looks = await Promise.all(
      activeButtons.map(async (button) => {
        const bgAndBorder = await paint(button)
        const weight = await button.evaluate(
          (el) => getComputedStyle(el).fontWeight,
        )
        return `${bgAndBorder}|${weight}`
      }),
    )
    expect(new Set(looks).size).toBe(looks.length)

    await openStory("components-pagination--size")
    const heights = await page
      .locator('[aria-current="page"]')
      .evaluateAll((buttons) =>
        buttons.map((el) => el.getBoundingClientRect().height),
      )
    expect(heights.length).toBeGreaterThan(1)
    expect(Math.max(...heights)).toBeGreaterThan(Math.min(...heights))
  })
})
