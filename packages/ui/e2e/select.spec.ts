import { expect, test } from "./fixtures"

test.describe("Select", () => {
  test("chooses an option and changes it from the keyboard", async ({
    openStory,
    page,
  }) => {
    await openStory("components-select--basic")
    const select = page.getByRole("combobox", { name: "Contact method" })

    await expect(select).toHaveValue("")
    await select.selectOption("post")
    await expect(select).toHaveValue("post")

    await select.focus()
    await page.keyboard.press("ArrowUp")
    await expect(select).toHaveValue("email")
  })

  test("multiple lists every option with the defaults selected", async ({
    openStory,
    page,
  }) => {
    await openStory("components-select--multiple")
    const list = page.getByRole("listbox", { name: "Contact methods" })

    await expect(list.getByRole("option")).toHaveCount(4)
    await expect(list.getByRole("option", { selected: true })).toHaveText([
      "Email",
      "Phone",
    ])
  })

  test("disabled is not focusable", async ({ openStory, page }) => {
    await openStory("components-select--disabled")
    const select = page.getByRole("combobox", { name: "Contact method" })

    await expect(select).toBeDisabled()
    await page.keyboard.press("Tab")
    await expect(select).not.toBeFocused()
  })

  test("read-only is focusable but keeps its value", async ({
    openStory,
    page,
  }) => {
    await openStory("components-select--read-only")
    const select = page.getByRole("combobox", { name: "Contact method" })

    await page.keyboard.press("Tab")
    await expect(select).toBeFocused()
    await expect(select).toHaveAttribute("aria-readonly", "true")
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("ArrowDown")
    await expect(select).toHaveValue("email")
  })

  test("field wires label, required and the error message", async ({
    openStory,
    page,
  }) => {
    await openStory("components-select--invalid")
    const select = page.getByRole("combobox", { name: "Contact method" })

    await expect(select).toHaveAttribute("aria-invalid", "true")
    await expect(select).toHaveAttribute("required", "")
    await expect(select).toHaveAccessibleDescription(
      /Choose a contact method\./,
    )
    await page.locator("label").getByText("Contact method").click()
    await expect(select).toBeFocused()
  })
})
