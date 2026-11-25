import { expect, modes, paint, test } from "./fixtures"

test.describe("Tooltip", () => {
  test("shows on focus and hover, hides on Escape, and adapts to light/dark modes", async ({
    openStory,
    page,
  }) => {
    await openStory("components-tooltip--basic")
    const trigger = page.getByRole("button", { name: "Hover or focus me" })
    const tip = page.getByRole("tooltip")

    await expect(tip).toBeHidden()
    await trigger.focus()
    await expect(tip).toBeVisible()
    await expect(tip).toHaveText("Helpful contextual tip")

    await page.keyboard.press("Escape")
    await expect(tip).toBeHidden()

    await trigger.hover()
    await expect(tip).toBeVisible()

    const surfaces = []
    for (const mode of modes) {
      await openStory("components-tooltip--basic", mode)
      await page.getByRole("button", { name: "Hover or focus me" }).focus()
      surfaces.push(await paint(page.getByRole("tooltip")))
    }
    expect(surfaces[0]).not.toBe(surfaces[1])
  })
})
