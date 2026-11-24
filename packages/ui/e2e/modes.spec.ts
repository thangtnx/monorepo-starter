import type { Locator, Page } from "@playwright/test"
import { expect, expectTokens, modes, test, tokenColor } from "./fixtures"

// Each story with the component and the properties it sets itself, by token.
const targets = [
  {
    id: "components-button--basic",
    checks: [["background-color", "--colors-primary-solid"]],
    pick: (page: Page) => page.getByRole("button", { name: "Continue" }),
  },
  {
    id: "components-field--basic",
    checks: [
      ["background-color", "--colors-bg"],
      ["border-top-color", "--colors-border-emphasized"],
    ],
    pick: (page: Page) => page.getByRole("textbox", { name: "Phone number" }),
  },
  {
    id: "components-badge--basic",
    checks: [["background-color", "--colors-neutral-subtle"]],
    pick: (page: Page) => page.getByText("Draft"),
  },
] satisfies {
  checks: [string, string][]
  id: string
  pick: (page: Page) => Locator
}[]
const stories = [
  "components-button--variants",
  "components-badge--color-schemes",
  "components-field--invalid",
]

test.describe("color modes", () => {
  test("the page background resolves differently in light and dark", async ({
    openStory,
    page,
  }) => {
    await openStory("components-button--basic", "light")
    const light = await tokenColor(page, "--colors-bg")
    await openStory("components-button--basic", "dark")

    expect(await tokenColor(page, "--colors-bg")).not.toBe(light)
  })

  for (const { id, checks, pick } of targets)
    test(`${id} takes its colors from the theme in both modes`, async ({
      openStory,
      page,
    }) => {
      for (const mode of modes) {
        await openStory(id, mode)
        await expectTokens(page, pick(page), checks)
      }
    })
})

test.describe("narrow viewport", () => {
  test.use({ viewport: { height: 700, width: 360 } })

  for (const id of stories)
    test(`${id} does not scroll horizontally`, async ({ openStory, page }) => {
      await openStory(id)

      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      )
      expect(overflow).toBeLessThanOrEqual(0)
    })

  test("field stays inside the viewport", async ({ openStory, page }) => {
    await openStory("components-field--invalid")
    const box = await page.getByLabel("Phone number").boundingBox()

    expect(box!.x).toBeGreaterThanOrEqual(0)
    expect(box!.x + box!.width).toBeLessThanOrEqual(360)
  })
})
