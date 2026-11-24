import { expect, test } from "./fixtures"

// The thumb overlaps the center of the native input's hit area.
const inputCorner = { x: 2, y: 2 }

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

  test("the large switch toggles", async ({ openStory, page }) => {
    await openStory("components-switch--size")
    const toggle = page.getByRole("switch", { name: "lg" })

    await expect(toggle).toBeChecked()
    await toggle.click({ position: inputCorner })
    await expect(toggle).not.toBeChecked()
  })

  test("a wrapping label toggles it", async ({ openStory, page }) => {
    await openStory("components-switch--parts")
    const toggle = page.getByRole("switch", { name: "Notifications" })
    const label = page.locator("label").filter({ hasText: "Notifications" })

    await expect(toggle).not.toBeChecked()
    await label.click()
    await expect(toggle).toBeChecked()
    await label.click()
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
    await toggle.click({ position: inputCorner })
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

  test("thin and thick switches center the thumb vertically on the track", async ({
    openStory,
    page,
  }) => {
    await openStory("components-switch--variant")
    const diffs = await page
      .locator('.ui-switch:is([data-variant="thin"], [data-variant="thick"])')
      .evaluateAll((switches) =>
        switches.slice(0, 6).map((sw) => {
          const track = sw
            .querySelector('[data-part="track"]')!
            .getBoundingClientRect()
          const thumb = sw
            .querySelector('[data-part="thumb"]')!
            .getBoundingClientRect()
          return Math.abs(
            (thumb.top + thumb.bottom) / 2 - (track.top + track.bottom) / 2,
          )
        }),
      )

    for (const diff of diffs) expect(diff).toBeLessThanOrEqual(1)
  })

  test("parts switch keeps a square thumb and centers state icons", async ({
    openStory,
    page,
  }) => {
    await openStory("components-switch--parts")
    const geometry = await page.locator(".ui-switch").evaluate((sw) => {
      const thumb = sw
        .querySelector('[data-part="thumb"]')!
        .getBoundingClientRect()
      const offIcon = sw
        .querySelector('[data-icon="off"] svg, [data-icon="off"]')!
        .getBoundingClientRect()
      return {
        aspectDiff: Math.abs(thumb.width - thumb.height),
        centerDiffY: Math.abs(
          (offIcon.top + offIcon.bottom) / 2 - (thumb.top + thumb.bottom) / 2,
        ),
      }
    })

    expect(geometry.aspectDiff).toBeLessThanOrEqual(1)
    expect(geometry.centerDiffY).toBeLessThanOrEqual(1)
  })
})
