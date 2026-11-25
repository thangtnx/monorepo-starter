import { expect, modes, paint, test } from "./fixtures"

test.describe("Menu", () => {
  test("navigates items with arrow keys skipping disabled items and closes on Escape", async ({
    openStory,
    page,
  }) => {
    await openStory("components-menu--basic")
    const trigger = page.getByRole("button", { name: "Actions" })
    await trigger.focus()
    await page.keyboard.press("ArrowDown")

    const menu = page.getByRole("menu", { name: "Actions" })
    await expect(menu).toBeVisible()
    await expect(page.getByRole("menuitem", { name: "New File" })).toBeFocused()

    await page.keyboard.press("ArrowDown")
    await expect(
      page.getByRole("menuitem", { name: "Duplicate" }),
    ).toBeFocused()

    await page.keyboard.press("ArrowDown")
    // Skips disabled "Archive" and focuses "Delete".
    await expect(page.getByRole("menuitem", { name: "Delete" })).toBeFocused()

    await page.keyboard.press("Escape")
    await expect(menu).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  test("updates checkbox and radio items and adapts to light/dark modes", async ({
    openStory,
    page,
  }) => {
    await openStory("components-menu--checkbox-and-radio")
    await page.getByRole("button", { name: "View Options" }).click()

    const checkbox = page.locator("button", {
      hasText: "Show grid lines",
    })
    await expect(checkbox).toHaveAttribute("aria-checked", "true")
    await checkbox.click()
    await expect(checkbox).toHaveAttribute("aria-checked", "false")

    const byName = page.locator("button", { hasText: "Name" })
    await byName.click()
    await expect(byName).toHaveAttribute("aria-checked", "true")

    const surfaces = []
    for (const mode of modes) {
      await openStory("components-menu--basic", mode)
      await page.getByRole("button", { name: "Actions" }).click()
      surfaces.push(await paint(page.getByRole("menu")))
    }
    expect(surfaces[0]).not.toBe(surfaces[1])
  })
})
