import { expect, test } from "./fixtures"

test.describe("Switch", () => {
  test("is a switch that toggles with Space", async ({ openStory, page }) => {
    await openStory("components-switch--basic")
    const toggle = page.getByRole("switch", { name: "Notifications" })

    await expect(toggle).not.toBeChecked()
    await page.keyboard.press("Tab")
    await expect(toggle).toBeFocused()
    await page.keyboard.press("Space")
    await expect(toggle).toBeChecked()
    await page.keyboard.press("Space")
    await expect(toggle).not.toBeChecked()
  })

  test("starts on when asked", async ({ openStory, page }) => {
    await openStory("components-switch--checked")

    await expect(
      page.getByRole("switch", { name: "Notifications" }),
    ).toBeChecked()
  })

  test("a wrapping label toggles it", async ({ openStory, page }) => {
    await openStory("components-switch--sizes")
    const toggle = page.getByRole("switch", { name: "lg" })

    await expect(toggle).toBeChecked()
    await page.getByText("lg", { exact: true }).click()
    await expect(toggle).not.toBeChecked()
  })

  test("disabled stays on and is skipped by keyboard", async ({
    openStory,
    page,
  }) => {
    await openStory("components-switch--disabled")
    const toggle = page.getByRole("switch", { name: "Notifications" })

    await expect(toggle).toBeDisabled()
    await expect(toggle).toBeChecked()
    await page.keyboard.press("Tab")
    await expect(toggle).not.toBeFocused()
  })

  test("read-only is focusable but cannot change", async ({
    openStory,
    page,
  }) => {
    await openStory("components-switch--read-only")
    const toggle = page.getByRole("switch", { name: "Notifications" })

    await page.keyboard.press("Tab")
    await expect(toggle).toBeFocused()
    await expect(toggle).toHaveAttribute("aria-readonly", "true")
    await page.keyboard.press("Space")
    await expect(toggle).toBeChecked()
    await toggle.click()
    await expect(toggle).toBeChecked()
  })

  test("field wires label, required and the error message", async ({
    openStory,
    page,
  }) => {
    await openStory("components-switch--invalid")
    const toggle = page.getByRole("switch", { name: "Notifications" })

    await expect(toggle).toHaveAttribute("aria-invalid", "true")
    await expect(toggle).toHaveAttribute("required", "")
    await expect(toggle).toHaveAccessibleDescription(/Review this choice\./)
    await page.locator("label").getByText("Notifications").click()
    await expect(toggle).toBeChecked()
  })
})
