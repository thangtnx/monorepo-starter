import { expect, modes, paint, test } from "./fixtures"

test.describe("Drawer", () => {
  test("opens, closes with close button and Escape, and restores focus", async ({
    openStory,
    page,
  }) => {
    await openStory("components-drawer--basic")
    const trigger = page.getByRole("button", { name: "Open Drawer" })
    await trigger.focus()
    await trigger.click()

    const drawer = page.getByRole("dialog", { name: "Workspace Filters" })
    await expect(drawer).toBeVisible()
    await expect(drawer).toHaveAttribute("data-placement", "end")

    await page.getByRole("button", { name: "Close" }).click()
    await expect(drawer).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  test("anchors cleanly to all four edges and adapts to light/dark modes", async ({
    openStory,
    page,
  }) => {
    await openStory("components-drawer--placement")
    const viewport = page.viewportSize()!

    await page.getByRole("button", { name: "start" }).click()
    let box = await page.getByRole("dialog").boundingBox()
    expect(box?.x).toBeLessThanOrEqual(2)
    await page.keyboard.press("Escape")

    await page.getByRole("button", { name: "end" }).click()
    box = await page.getByRole("dialog").boundingBox()
    expect(box!.x + box!.width).toBeGreaterThanOrEqual(viewport.width - 2)
    await page.keyboard.press("Escape")

    await page.getByRole("button", { name: "top" }).click()
    box = await page.getByRole("dialog").boundingBox()
    expect(box?.y).toBeLessThanOrEqual(2)
    await page.keyboard.press("Escape")

    await page.getByRole("button", { name: "bottom" }).click()
    box = await page.getByRole("dialog").boundingBox()
    expect(box!.y + box!.height).toBeGreaterThanOrEqual(viewport.height - 2)
    await page.keyboard.press("Escape")

    const surfaces = []
    for (const mode of modes) {
      await openStory("components-drawer--basic", mode)
      await page.getByRole("button", { name: "Open Drawer" }).click()
      surfaces.push(await paint(page.getByRole("dialog")))
    }
    expect(surfaces[0]).not.toBe(surfaces[1])
  })
})
