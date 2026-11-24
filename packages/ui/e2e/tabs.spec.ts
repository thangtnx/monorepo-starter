import { expect, expectTokens, modes, test } from "./fixtures"

test.describe("Tabs", () => {
  test("switches panels on click and keyboard arrows", async ({
    openStory,
    page,
  }) => {
    await openStory("components-tabs--basic")

    const account = page.getByRole("tab", { name: "Account" })
    const security = page.getByRole("tab", { name: "Security" })
    const billing = page.getByRole("tab", { name: "Billing" })

    await expect(account).toHaveAttribute("aria-selected", "true")
    await expect(page.getByRole("tabpanel", { name: "Account" })).toBeVisible()

    await page.keyboard.press("Tab")
    await expect(account).toBeFocused()
    await page.keyboard.press("ArrowRight")
    await expect(security).toBeFocused()
    await expect(security).toHaveAttribute("aria-selected", "true")
    await expect(page.getByRole("tabpanel", { name: "Security" })).toBeVisible()

    await page.keyboard.press("End")
    await expect(billing).toBeFocused()
    await expect(billing).toHaveAttribute("aria-selected", "true")

    await page.keyboard.press("Home")
    await expect(account).toBeFocused()
    await expect(account).toHaveAttribute("aria-selected", "true")

    await billing.click()
    await expect(billing).toHaveAttribute("aria-selected", "true")
    await expect(page.getByRole("tabpanel", { name: "Billing" })).toBeVisible()
  })

  test("skips disabled tabs on arrow navigation", async ({
    openStory,
    page,
  }) => {
    await openStory("components-tabs--disabled")

    const account = page.getByRole("tab", { name: "Account" })
    const security = page.getByRole("tab", { name: "Security" })
    const billing = page.getByRole("tab", { name: "Billing" })

    await expect(security).toBeDisabled()
    await page.keyboard.press("Tab")
    await expect(account).toBeFocused()
    await page.keyboard.press("ArrowRight")
    await expect(billing).toBeFocused()
    await expect(billing).toHaveAttribute("aria-selected", "true")
  })

  test("supports manual activation", async ({ openStory, page }) => {
    await openStory("components-tabs--manual")

    const account = page.getByRole("tab", { name: "Account" })
    const security = page.getByRole("tab", { name: "Security" })

    await page.keyboard.press("Tab")
    await page.keyboard.press("ArrowRight")
    await expect(security).toBeFocused()
    await expect(account).toHaveAttribute("aria-selected", "true")
    await expect(security).toHaveAttribute("aria-selected", "false")

    await page.keyboard.press("Enter")
    await expect(security).toHaveAttribute("aria-selected", "true")
    await expect(page.getByRole("tabpanel", { name: "Security" })).toBeVisible()
  })

  test("supports vertical orientation with ArrowDown and ArrowUp", async ({
    openStory,
    page,
  }) => {
    await openStory("components-tabs--orientation")

    const tablist = page.getByRole("tablist")
    const account = page.getByRole("tab", { name: "Account" })
    const security = page.getByRole("tab", { name: "Security" })

    await expect(tablist).toHaveAttribute("aria-orientation", "vertical")
    await page.keyboard.press("Tab")
    await page.keyboard.press("ArrowDown")
    await expect(security).toBeFocused()
    await expect(security).toHaveAttribute("aria-selected", "true")

    await page.keyboard.press("ArrowUp")
    await expect(account).toBeFocused()
    await expect(account).toHaveAttribute("aria-selected", "true")
  })

  test("takes active tab colors from the theme in both modes", async ({
    openStory,
    page,
  }) => {
    for (const mode of modes) {
      await openStory("components-tabs--basic", mode)
      await expectTokens(page, page.getByRole("tab", { selected: true }), [
        ["color", "--colors-primary-fg"],
        ["border-bottom-color", "--colors-primary-solid"],
      ])
    }
  })
})
