import { expect, test } from "./fixtures"

test.describe("Button", () => {
  test("renders every variant as an enabled button", async ({
    openStory,
    page,
  }) => {
    await openStory("components-button--variants")
    const buttons = page.getByRole("button")

    expect(await buttons.count()).toBeGreaterThan(1)
    for (const button of await buttons.all()) {
      await expect(button).toBeEnabled()
      await expect(button).toHaveAttribute("type", "button")
    }
  })

  test("variants look different from each other", async ({
    openStory,
    page,
  }) => {
    await openStory("components-button--variants")
    const styles = await page.getByRole("button").evaluateAll((els) =>
      els.map((el) => {
        const s = getComputedStyle(el)
        return `${s.backgroundColor}|${s.borderTopColor}|${s.color}`
      }),
    )

    expect(new Set(styles).size).toBeGreaterThan(1)
  })

  test("a disabled button is disabled and skipped by keyboard", async ({
    openStory,
    page,
  }) => {
    await openStory("components-button--disabled")
    const button = page.getByRole("button", { name: "Continue" })

    await expect(button).toBeDisabled()
    await page.keyboard.press("Tab")
    await expect(button).not.toBeFocused()
  })

  test("takes keyboard focus with a visible indicator and activates with Enter and Space", async ({
    openStory,
    page,
  }) => {
    await openStory("components-button--basic")
    const button = page.getByRole("button", { name: "Continue" })
    await button.evaluate((el) => {
      el.addEventListener("click", () => {
        el.dataset.clicks = String(Number(el.dataset.clicks ?? 0) + 1)
      })
    })

    await page.keyboard.press("Tab")
    await expect(button).toBeFocused()
    await expect(button).toHaveCSS("outline-style", "solid")
    await expect(button).toHaveCSS("outline-width", "2px")

    await page.keyboard.press("Enter")
    await page.keyboard.press("Space")
    await expect(button).toHaveAttribute("data-clicks", "2")
  })

  test("full width button fills its parent content box", async ({
    openStory,
    page,
  }) => {
    await openStory("components-button--full-width")
    const { button, content } = await page
      .getByRole("button", { name: "Continue" })
      .evaluate((el) => {
        const parent = getComputedStyle(el.parentElement!)
        return {
          button: el.getBoundingClientRect().width,
          content:
            el.parentElement!.clientWidth -
            parseFloat(parent.paddingLeft) -
            parseFloat(parent.paddingRight),
        }
      })

    expect(Math.abs(button - content)).toBeLessThanOrEqual(1)
  })
})
