import { expect, modes, paint, test } from "./fixtures"

test.describe("Dialog", () => {
  test("opens, locks scroll, closes on Escape and backdrop click, and restores focus", async ({
    openStory,
    page,
  }) => {
    await openStory("components-dialog--basic")
    const trigger = page.getByRole("button", { name: "Open Dialog" })
    await trigger.focus()
    await trigger.click()

    const dialog = page.getByRole("dialog", { name: "Confirm Action" })
    await expect(dialog).toBeVisible()
    await expect(page.locator("html")).toHaveCSS("overflow", "hidden")

    await page.keyboard.press("Escape")
    await expect(dialog).toBeHidden()
    await expect(page.locator("html")).not.toHaveCSS("overflow", "hidden")
    await expect(trigger).toBeFocused()

    // Reopen and close by clicking backdrop outside the dialog card.
    await trigger.click()
    await expect(dialog).toBeVisible()
    await page.mouse.click(10, 10)
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  test("renders distinct widths across sizes and distinct surface contrast in light/dark modes", async ({
    openStory,
    page,
  }) => {
    await openStory("components-dialog--size")
    await page.getByRole("button", { name: "Open sm" }).click()
    const smWidth = await page
      .getByRole("dialog")
      .evaluate((el: HTMLElement) => el.offsetWidth)
    await page.keyboard.press("Escape")

    await page.getByRole("button", { name: "Open xl" }).click()
    const xlWidth = await page
      .getByRole("dialog")
      .evaluate((el: HTMLElement) => el.offsetWidth)
    await page.keyboard.press("Escape")

    await page.getByRole("button", { name: "Open full" }).click()
    const fullWidth = await page
      .getByRole("dialog")
      .evaluate((el: HTMLElement) => el.offsetWidth)
    expect(fullWidth).toBeGreaterThan(smWidth)
    if ((page.viewportSize()?.width ?? 0) >= 640)
      expect(xlWidth).toBeGreaterThan(smWidth)
    await page.keyboard.press("Escape")

    const surfaces = []
    for (const mode of modes) {
      await openStory("components-dialog--basic", mode)
      await page.getByRole("button", { name: "Open Dialog" }).click()
      const dialog = page.getByRole("dialog")
      surfaces.push(await paint(dialog))
    }
    expect(surfaces[0]).not.toBe(surfaces[1])
  })
})
