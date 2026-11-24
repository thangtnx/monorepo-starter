import { expect, test } from "./fixtures"

test.describe("Textarea", () => {
  test("takes keyboard focus and typing", async ({ openStory, page }) => {
    await openStory("components-textarea--basic")
    const notes = page.getByRole("textbox", { name: "Notes" })

    await page.keyboard.press("Tab")
    await expect(notes).toBeFocused()
    await page.keyboard.type("First line")
    await page.keyboard.press("Enter")
    await page.keyboard.type("Second line")
    await expect(notes).toHaveValue("First line\nSecond line")
  })

  test("disabled is not focusable and read-only keeps its value", async ({
    openStory,
    page,
  }) => {
    await openStory("components-textarea--disabled")
    const disabled = page.getByRole("textbox", { name: "Notes" })
    await expect(disabled).toBeDisabled()
    await page.keyboard.press("Tab")
    await expect(disabled).not.toBeFocused()

    await openStory("components-textarea--read-only")
    const notes = page.getByRole("textbox", { name: "Notes" })
    await page.keyboard.press("Tab")
    await expect(notes).toBeFocused()
    await page.keyboard.type("edit")
    await expect(notes).toHaveValue("This note is archived.")
  })

  test("field wires label, required and the error message", async ({
    openStory,
    page,
  }) => {
    await openStory("components-textarea--invalid")
    const notes = page.getByRole("textbox", { name: "Notes" })

    await expect(notes).toHaveAttribute("aria-invalid", "true")
    await expect(notes).toHaveAttribute("required", "")
    await expect(notes).toHaveAccessibleDescription(
      /Add a note before submitting\./,
    )
    await page.locator("label").getByText("Notes").click()
    await expect(notes).toBeFocused()
  })
})
