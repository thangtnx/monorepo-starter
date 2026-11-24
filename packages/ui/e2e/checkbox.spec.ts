import { expect, test } from "./fixtures"

test.describe("Checkbox", () => {
  test("toggles with Space from the keyboard", async ({ openStory, page }) => {
    await openStory("components-checkbox--basic")
    const box = page.getByRole("checkbox", { name: "Send updates" })

    await expect(box).not.toBeChecked()
    await page.keyboard.press("Tab")
    await expect(box).toBeFocused()
    await page.keyboard.press("Space")
    await expect(box).toBeChecked()
    await page.keyboard.press("Space")
    await expect(box).not.toBeChecked()
  })

  test("starts checked when asked", async ({ openStory, page }) => {
    await openStory("components-checkbox--checked")

    await expect(
      page.getByRole("checkbox", { name: "Send updates" }),
    ).toBeChecked()
  })

  test("a wrapping label toggles it", async ({ openStory, page }) => {
    await openStory("components-checkbox--sizes")
    const box = page.getByRole("checkbox", { name: "md" })

    await expect(box).toBeChecked()
    await page.getByText("md", { exact: true }).click()
    await expect(box).not.toBeChecked()
  })

  test("disabled stays checked and is skipped by keyboard", async ({
    openStory,
    page,
  }) => {
    await openStory("components-checkbox--disabled")
    const box = page.getByRole("checkbox", { name: "Send updates" })

    await expect(box).toBeDisabled()
    await expect(box).toBeChecked()
    await page.keyboard.press("Tab")
    await expect(box).not.toBeFocused()
  })

  test("read-only is focusable but cannot change", async ({
    openStory,
    page,
  }) => {
    await openStory("components-checkbox--read-only")
    const box = page.getByRole("checkbox", { name: "Send updates" })

    await page.keyboard.press("Tab")
    await expect(box).toBeFocused()
    await expect(box).toHaveAttribute("aria-readonly", "true")
    await page.keyboard.press("Space")
    await expect(box).toBeChecked()
    await box.click()
    await expect(box).toBeChecked()
  })

  test("field wires label, required and the error message", async ({
    openStory,
    page,
  }) => {
    await openStory("components-checkbox--invalid")
    const box = page.getByRole("checkbox", { name: "Send updates" })

    await expect(box).toHaveAttribute("aria-invalid", "true")
    await expect(box).toHaveAttribute("required", "")
    await expect(box).toHaveAccessibleDescription(/Review this choice\./)
    await page.locator("label").getByText("Send updates").click()
    await expect(box).toBeChecked()
  })
})
