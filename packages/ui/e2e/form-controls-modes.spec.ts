import type { Locator, Page } from "@playwright/test"
import { expect, expectTokens, modes, test } from "./fixtures"

const tokenControls = [
  {
    id: "components-textarea--basic",
    checks: [
      ["background-color", "--colors-bg"],
      ["border-top-color", "--colors-border-emphasized"],
    ],
    pick: (page: Page) => page.getByRole("textbox", { name: "Notes" }),
  },
  {
    id: "components-select--basic",
    checks: [
      ["background-color", "--colors-bg"],
      ["border-top-color", "--colors-border-emphasized"],
    ],
    pick: (page: Page) =>
      page.getByRole("combobox", { name: "Contact method" }),
  },
  {
    id: "components-checkbox--checked",
    checks: [["background-color", "--colors-primary-solid"]],
    pick: (page: Page) => page.locator('.ui-checkbox [data-part="indicator"]'),
  },
  {
    id: "components-radio--checked",
    checks: [["background-color", "--colors-primary-solid"]],
    pick: (page: Page) => page.locator('.ui-radio [data-part="indicator"]'),
  },
  {
    id: "components-switch--checked",
    checks: [["background-color", "--colors-primary-solid"]],
    pick: (page: Page) => page.locator('.ui-switch [data-part="track"]'),
  },
] satisfies {
  checks: [string, string][]
  id: string
  pick: (page: Page) => Locator
}[]

// Properties each control sets itself must equal their token in both modes.
for (const { id, checks, pick } of tokenControls)
  test(`${id} takes its colors from the theme in both modes`, async ({
    openStory,
    page,
  }) => {
    for (const mode of modes) {
      await openStory(id, mode)
      await expectTokens(page, pick(page), checks)
    }
  })

test("form controls fit a narrow viewport", async ({ openStory, page }) => {
  await page.setViewportSize({ height: 700, width: 360 })
  for (const id of [
    "components-textarea--invalid",
    "components-select--invalid",
    "components-checkbox--invalid",
    "components-radiogroup--invalid",
    "components-switch--invalid",
  ]) {
    await openStory(id)
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    )
    expect(overflow, id).toBeLessThanOrEqual(0)
  }
})
