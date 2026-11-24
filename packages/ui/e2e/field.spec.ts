import { expect, test } from "./fixtures"

test.describe("Field and Input", () => {
  test("label is associated with the input and focuses it on click", async ({
    openStory,
    page,
  }) => {
    await openStory("components-field--basic")
    const input = page.getByLabel("Phone number")

    await expect(input).toBeVisible()
    await page.getByText("Phone number").click()
    await expect(input).toBeFocused()
  })

  test("hint is the accessible description", async ({ openStory, page }) => {
    await openStory("components-field--basic")

    await expect(
      page.getByRole("textbox", { name: "Phone number" }),
    ).toHaveAccessibleDescription("We call you back within one working day.")
  })

  test("required marks the input required and shows a marker", async ({
    openStory,
    page,
  }) => {
    await openStory("components-field--required")

    await expect(
      page.getByRole("textbox", { name: "Phone number" }),
    ).toHaveAttribute("required", "")
    await expect(page.locator("#storybook-root").getByText("*")).toBeVisible()
  })

  test("error replaces the hint, is described and marks the input invalid", async ({
    openStory,
    page,
  }) => {
    await openStory("components-field--invalid")
    const input = page.getByRole("textbox", { name: "Phone number" })

    await expect(input).toHaveAttribute("aria-invalid", "true")
    await expect(input).toHaveAccessibleDescription(
      /Enter a 10-digit phone number\./,
    )
    await expect(page.getByText("We call you back")).toHaveCount(0)
    await expect(page.getByText("Enter a 10-digit phone number.")).toBeVisible()
  })

  test("keyboard focus reaches the input and typing works", async ({
    openStory,
    page,
  }) => {
    await openStory("components-field--basic")
    const input = page.getByLabel("Phone number")

    await page.keyboard.press("Tab")
    await expect(input).toBeFocused()
    await page.keyboard.type("0901234567")
    await expect(input).toHaveValue("0901234567")
  })

  test("disabled and read-only states are exposed", async ({
    openStory,
    page,
  }) => {
    await openStory("components-field--disabled")
    await expect(page.getByLabel("Phone number")).toBeDisabled()

    await openStory("components-field--read-only")
    const input = page.getByLabel("Phone number")
    await expect(input).toHaveAttribute("readonly", "")
    await expect(input).toHaveValue("0901 234 567")
  })

  test("standalone input exposes invalid and disabled", async ({
    openStory,
    page,
  }) => {
    await openStory("components-input--invalid")
    await expect(
      page.getByRole("textbox", { name: "Full name" }),
    ).toHaveAttribute("aria-invalid", "true")

    await openStory("components-input--disabled")
    await expect(
      page.getByRole("textbox", { name: "Full name" }),
    ).toBeDisabled()
  })
})
