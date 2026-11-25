import { expect, modes, paint, test } from "./fixtures"

test.describe("Popover", () => {
  test("opens anchored to trigger, closes on Escape and outside click, and restores focus", async ({
    openStory,
    page,
  }) => {
    await openStory("components-popover--basic")
    const trigger = page.getByRole("button", { name: "Open Popover" })
    await trigger.focus()
    await trigger.click()

    const dialog = page.getByRole("dialog", { name: "Project details" })
    await expect(dialog).toBeVisible()

    const triggerBox = await trigger.boundingBox()
    const panelBox = await dialog.boundingBox()
    expect(panelBox).not.toBeNull()
    expect(panelBox!.y).toBeGreaterThanOrEqual(triggerBox!.y)

    await page.keyboard.press("Escape")
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()

    await trigger.click()
    await expect(dialog).toBeVisible()
    await page.mouse.click(5, 5)
    await expect(dialog).toBeHidden()
  })

  test("adapts panel surface across light and dark modes", async ({
    openStory,
    page,
  }) => {
    const surfaces = []
    for (const mode of modes) {
      await openStory("components-popover--basic", mode)
      await page.getByRole("button", { name: "Open Popover" }).click()
      surfaces.push(await paint(page.getByRole("dialog")))
    }
    expect(surfaces[0]).not.toBe(surfaces[1])
  })
})
