import type { Locator, Page } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
import { test as base, expect } from "@playwright/test"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"

export type Mode = "dark" | "light"

export const modes: Mode[] = ["light", "dark"]

interface Entry {
  id: string
  type: "docs" | "story"
  tags?: string[]
}

const indexPath = join(import.meta.dirname, "../storybook-static/index.json")

/**
 * Story ids opted in to testing with the `test` tag, like Storybook itself.
 * The scan does not read story-level a11y parameters.
 */
export const storyIds = (): string[] => {
  if (!existsSync(indexPath))
    throw new Error("storybook-static is missing: run pnpm ui build:storybook")

  const index = JSON.parse(readFileSync(indexPath, "utf8")) as {
    entries: { [id: string]: Entry }
  }

  return Object.values(index.entries)
    .filter((entry) => entry.type === "story" && entry.tags?.includes("test"))
    .map((entry) => entry.id)
}

/**
 * Background and border colors only: the text color is inherited and the
 * default border follows it, so it could hide a broken component declaration.
 */
export const paint = (locator: Locator) =>
  locator.evaluate((el) => {
    const s = getComputedStyle(el)
    return `${s.backgroundColor}|${s.borderTopColor}`
  })

/** A computed CSS property that the component sets itself, such as `accent-color`. */
export const owned = (locator: Locator, property: string) =>
  locator.evaluate(
    (el, name) => getComputedStyle(el).getPropertyValue(name),
    property,
  )

/** The resolved color of a theme variable in the story's current mode. */
export const tokenColor = (page: Page, variable: string) =>
  page.evaluate((name) => {
    // An undefined variable would fall back to the inherited text color.
    if (!getComputedStyle(document.documentElement).getPropertyValue(name))
      throw new Error(`${name} is not defined in the theme`)
    const probe = document.createElement("span")
    probe.style.color = `var(${name})`
    document.body.append(probe)
    const color = getComputedStyle(probe).color
    probe.remove()
    return color
  }, variable)

export const test = base.extend<{
  openStory: (id: string, mode?: Mode) => Promise<void>
  scan: () => Promise<string[]>
}>({
  openStory: async ({ page }, use) => {
    await use(async (id, mode = "light") => {
      await page.goto(
        `/iframe.html?id=${id}&viewMode=story&globals=mode:${mode}`,
      )
      await expect(page.locator(`[data-mode="${mode}"]`)).toBeVisible()
    })
  },
  scan: async ({ page }, use) => {
    await use(async () => {
      // The Storybook a11y addon scans the page on load; axe rejects a second
      // concurrent run, so retry until the addon is done.
      let violations: Awaited<ReturnType<AxeBuilder["analyze"]>>["violations"] =
        []
      await expect(async () => {
        ;({ violations } = await new AxeBuilder({ page })
          .include("#storybook-root")
          .analyze())
      }).toPass()

      return violations.map(
        (v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`,
      )
    })
  },
})

export { expect }

/** Each property the component owns must equal its token in the current mode. */
export const expectTokens = async (
  page: Page,
  locator: Locator,
  checks: [property: string, variable: string][],
) => {
  for (const [property, variable] of checks)
    expect(await owned(locator, property), property).toBe(
      await tokenColor(page, variable),
    )
}
