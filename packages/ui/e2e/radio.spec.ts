import { expect, test } from "./fixtures"

test.describe("RadioGroup", () => {
  test("selects one option by click and arrow keys", async ({
    openStory,
    page,
  }) => {
    await openStory("components-radiogroup--basic")
    const group = page.getByRole("radiogroup", { name: "Shipping speed" })
    const standard = group.getByRole("radio", { name: "Standard" })
    const express = group.getByRole("radio", { name: "Express" })

    await expect(standard).toBeChecked()
    await express.click()
    await expect(express).toBeChecked()
    await expect(standard).not.toBeChecked()

    // WebKit does not focus a radio on click, so focus it as a Tab would.
    await express.focus()
    await page.keyboard.press("ArrowUp")
    await expect(standard).toBeChecked()
    await expect(standard).toBeFocused()
  })

  test("one tab stop enters the group on the checked radio", async ({
    openStory,
    page,
  }) => {
    await openStory("components-radiogroup--basic")

    await page.keyboard.press("Tab")
    await expect(page.getByRole("radio", { name: "Standard" })).toBeFocused()
    await page.keyboard.press("Tab")
    await expect(page.getByRole("radio", { name: "Express" })).not.toBeFocused()
  })

  test("disabled group disables every radio", async ({ openStory, page }) => {
    await openStory("components-radiogroup--disabled")

    await expect(page.getByRole("radio", { name: "Standard" })).toBeDisabled()
    await expect(page.getByRole("radio", { name: "Express" })).toBeDisabled()
  })

  test("read-only group keeps its selection", async ({ openStory, page }) => {
    await openStory("components-radiogroup--read-only")
    await expect(
      page.getByRole("radiogroup", { name: "Shipping speed" }),
    ).toHaveAttribute("aria-readonly", "true")
    const standard = page.getByRole("radio", { name: "Standard" })
    const express = page.getByRole("radio", { name: "Express" })

    await express.click()
    await expect(standard).toBeChecked()
    await expect(express).not.toBeChecked()
    await standard.focus()
    await page.keyboard.press("ArrowDown")
    await expect(standard).toBeChecked()
  })

  test("field marks the group invalid and describes the error", async ({
    openStory,
    page,
  }) => {
    await openStory("components-radiogroup--invalid")
    const group = page.getByRole("radiogroup", { name: "Shipping speed" })

    await expect(group).toHaveAttribute("aria-invalid", "true")
    await expect(group).toHaveAccessibleDescription(/Choose a shipping speed\./)
    await expect(page.getByRole("radio", { checked: true })).toHaveCount(0)
  })
})

test.describe("Radio", () => {
  test("starts checked and is focusable", async ({ openStory, page }) => {
    await openStory("components-radio--checked")
    const radio = page.getByRole("radio", { name: "Standard shipping" })

    await expect(radio).toBeChecked()
    await page.keyboard.press("Tab")
    await expect(radio).toBeFocused()
  })

  test("a lone radio selects with Space", async ({ openStory, page }) => {
    await openStory("components-radio--basic")
    const radio = page.getByRole("radio", { name: "Standard shipping" })

    await page.keyboard.press("Tab")
    await page.keyboard.press("Space")
    await expect(radio).toBeChecked()
  })

  test("disabled and read-only keep their checked state", async ({
    openStory,
    page,
  }) => {
    await openStory("components-radio--disabled")
    await expect(
      page.getByRole("radio", { name: "Standard shipping" }),
    ).toBeDisabled()

    await openStory("components-radio--read-only")
    const radio = page.getByRole("radio", { name: "Standard shipping" })
    await expect(radio).toBeChecked()
    await radio.click()
    await expect(radio).toBeChecked()
  })

  test("field wires label, required and the error message", async ({
    openStory,
    page,
  }) => {
    await openStory("components-radio--invalid")
    const radio = page.getByRole("radio", { name: "Standard shipping" })

    await expect(radio).toHaveAttribute("aria-invalid", "true")
    await expect(radio).toHaveAttribute("required", "")
    await expect(radio).toHaveAccessibleDescription(/Review this choice\./)
  })
})
