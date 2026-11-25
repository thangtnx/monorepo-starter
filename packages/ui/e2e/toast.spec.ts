import { expect, modes, paint, test } from "./fixtures"

test.describe("Toast", () => {
  test("triggers notification region, supports dismissal, and adapts to light/dark modes", async ({
    openStory,
    page,
  }) => {
    await openStory("components-toast--basic")
    await page.getByRole("button", { name: "Show Toast" }).click()

    const region = page.getByRole("region", { name: "Notifications" })
    await expect(region.getByText("Changes published")).toBeVisible()
    await region.getByRole("button", { name: "Dismiss notification" }).click()
    await expect(region.getByText("Changes published")).toBeHidden()

    const surfaces = []
    for (const mode of modes) {
      await openStory("components-toast--status", mode)
      await page.getByRole("button", { name: "error" }).click()
      const item = page.locator(".ui-notice-item").first()
      await expect(item).toBeVisible()
      surfaces.push(await paint(item))
    }
    expect(surfaces[0]).not.toBe(surfaces[1])
  })
})
