import { expect, paint, test } from "./fixtures"

const badges = ".ui-badge"

test.describe("Badge", () => {
  test("shows its text content", async ({ openStory, page }) => {
    await openStory("components-badge--basic")

    await expect(page.getByText("Draft")).toBeVisible()
  })

  for (const id of [
    "components-badge--variants",
    "components-badge--color-schemes",
  ])
    test(`${id} renders several visible, non-empty badges`, async ({
      openStory,
      page,
    }) => {
      await openStory(id)
      const all = page.locator(badges)

      expect(await all.count()).toBeGreaterThan(1)
      for (const badge of await all.all()) {
        await expect(badge).toBeVisible()
        await expect(badge).not.toBeEmpty()
      }
    })

  test("variants look different from each other", async ({
    openStory,
    page,
  }) => {
    await openStory("components-badge--variants")
    const looks = await Promise.all(
      (await page.locator(badges).all()).map((badge) => paint(badge)),
    )

    expect(looks.length).toBeGreaterThan(1)
    expect(new Set(looks).size).toBe(looks.length)
  })

  test("sizes grow in height", async ({ openStory, page }) => {
    await openStory("components-badge--sizes")
    const heights = await page
      .locator(badges)
      .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().height))

    expect(heights.length).toBeGreaterThan(1)
    expect(Math.max(...heights)).toBeGreaterThan(Math.min(...heights))
  })
})
