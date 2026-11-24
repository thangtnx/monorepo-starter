import type { Locator, Page } from "@playwright/test"
import { join } from "node:path"
import {
  expect,
  expectTokens,
  modes,
  owned,
  test,
  tokenColor,
} from "./fixtures"

const shots = join(import.meta.dirname, "../../../.harness/team/logs/T-22")

/** Opens a story with Storybook URL args such as `required:!true`. */
const visit = async (
  page: Page,
  id: string,
  { args = "", mode = "light" }: { args?: string; mode?: string } = {},
) => {
  await page.goto(
    `/iframe.html?id=${id}&viewMode=story&globals=mode:${mode}${args ? `&args=${args}` : ""}`,
  )
  await expect(page.locator(`[data-mode="${mode}"]`)).toBeVisible()
}

const combobox = (page: Page, name = "Contact method") =>
  page.getByRole("combobox", { name })

const listbox = (page: Page) => page.getByRole("listbox")

const expectOpen = async (trigger: Locator, page: Page) => {
  await expect(trigger).toHaveAttribute("aria-expanded", "true")
  await expect(listbox(page)).toBeVisible()
}

const expectClosed = async (trigger: Locator, page: Page) => {
  await expect(trigger).toHaveAttribute("aria-expanded", "false")
  await expect(listbox(page)).toBeHidden()
}

const expectActive = async (trigger: Locator, option: Locator) =>
  expect(trigger).toHaveAttribute(
    "aria-activedescendant",
    (await option.getAttribute("id")) ?? "",
  )

/** Lets two frames pass so a delayed second toggle would have happened. */
const settle = (page: Page) =>
  page.evaluate(
    () =>
      new Promise<void>((done) =>
        requestAnimationFrame(() => requestAnimationFrame(() => done())),
      ),
  )

test.describe("Select opening and closing", () => {
  test("opens and closes by click", async ({ page }) => {
    await visit(page, "components-select--basic")
    const trigger = combobox(page)

    await expectClosed(trigger, page)
    await trigger.click()
    await expectOpen(trigger, page)
    await expect(trigger).toBeFocused()
    await trigger.click()
    await expectClosed(trigger, page)
  })

  for (const [label, press] of [
    ["Enter", "Enter"],
    ["Space", " "],
    ["ArrowDown", "ArrowDown"],
    ["ArrowUp", "ArrowUp"],
    ["Alt+ArrowDown", "Alt+ArrowDown"],
  ] as const)
    test(`opens with ${label} and stays open`, async ({ page }) => {
      await visit(page, "components-select--basic")
      const trigger = combobox(page)

      await trigger.focus()
      await page.keyboard.press(press)
      await expectOpen(trigger, page)
      // Firefox and WebKit may click a button on Space keyup.
      await settle(page)
      await expectOpen(trigger, page)
    })

  test("Alt+ArrowUp, Enter and Escape close it and keep focus", async ({
    page,
  }) => {
    await visit(page, "components-select--basic")
    const trigger = combobox(page)

    await trigger.focus()
    await page.keyboard.press("Alt+ArrowDown")
    await expectOpen(trigger, page)
    await page.keyboard.press("Alt+ArrowUp")
    await expectClosed(trigger, page)

    await page.keyboard.press("Enter")
    await expectOpen(trigger, page)
    await page.keyboard.press("Enter")
    await expectClosed(trigger, page)

    await page.keyboard.press("ArrowDown")
    await expectOpen(trigger, page)
    await page.keyboard.press("Escape")
    await expectClosed(trigger, page)
    await expect(trigger).toBeFocused()
  })

  test("a click outside closes it", async ({ page }) => {
    await visit(page, "components-select--basic")
    const trigger = combobox(page)

    await trigger.click()
    await expectOpen(trigger, page)
    await page.mouse.click(2, 2)
    await expectClosed(trigger, page)
  })

  test("presses on the group label, separator and padding keep it open", async ({
    page,
  }) => {
    await visit(page, "components-select--groups")
    const trigger = combobox(page)
    await trigger.click()
    await expectOpen(trigger, page)

    await listbox(page).getByText("Online").click()
    await expectOpen(trigger, page)

    const separator = await listbox(page)
      .locator("[data-part=separator]")
      .boundingBox()
    if (!separator) throw new Error("separator has no box")
    await page.mouse.click(
      separator.x + separator.width / 2,
      separator.y + separator.height / 2,
    )
    await expectOpen(trigger, page)

    await listbox(page).click({ position: { x: 3, y: 3 } })
    await expectOpen(trigger, page)
    await expect(trigger).toBeFocused()
  })

  test("dragging the scrollbar of a long list keeps it open", async ({
    page,
  }, testInfo) => {
    await visit(page, "components-select--long-list")
    const trigger = combobox(page, "Time slot")
    await trigger.click()
    await expectOpen(trigger, page)

    const metrics = await listbox(page).evaluate((node) => {
      const el = node as HTMLElement

      const { height, right, top } = el.getBoundingClientRect()
      return {
        bar: el.offsetWidth - el.clientWidth - el.clientLeft * 2,
        height,
        right: right - el.clientLeft,
        top,
      }
    })
    test.skip(metrics.bar < 4, "overlay scrollbar: nothing to drag here")
    testInfo.annotations.push({
      type: "scrollbar",
      description: `${metrics.bar}px`,
    })

    const x = metrics.right - metrics.bar / 2
    await page.mouse.move(x, metrics.top + 20)
    await page.mouse.down()
    await page.mouse.move(x, metrics.top + metrics.height - 10, { steps: 5 })
    await page.mouse.up()
    await expectOpen(trigger, page)
  })

  test("a label click focuses without opening", async ({ page }) => {
    await visit(page, "components-select--in-field")
    const trigger = combobox(page)

    await page.locator("label", { hasText: "Contact method" }).click()
    await expect(trigger).toBeFocused()
    await settle(page)
    await expectClosed(trigger, page)
  })
})

test.describe("Select choosing", () => {
  test("arrows, Home and End move the active option", async ({ page }) => {
    await visit(page, "components-select--basic")
    const trigger = combobox(page)
    const option = (name: string) => listbox(page).getByRole("option", { name })

    await trigger.focus()
    await page.keyboard.press("Enter")
    await expectActive(trigger, option("Choose a contact method"))
    await page.keyboard.press("ArrowDown")
    await expectActive(trigger, option("Email"))
    await page.keyboard.press("ArrowDown")
    await expectActive(trigger, option("Phone"))
    // The disabled "Post" is skipped.
    await page.keyboard.press("ArrowDown")
    await expectActive(trigger, option("Text message"))
    await page.keyboard.press("ArrowDown")
    await expectActive(trigger, option("Text message"))
    await page.keyboard.press("Home")
    await expectActive(trigger, option("Choose a contact method"))
    await page.keyboard.press("ArrowUp")
    await expectActive(trigger, option("Choose a contact method"))
    await page.keyboard.press("End")
    await expectActive(trigger, option("Text message"))
  })

  test("typeahead finds an option while closed and while open", async ({
    page,
  }) => {
    await visit(page, "components-select--basic")
    const trigger = combobox(page)
    const option = (name: string) => listbox(page).getByRole("option", { name })

    // One letter per search: a longer one depends on the 500 ms window.
    await trigger.focus()
    await page.keyboard.press("t")
    await expectOpen(trigger, page)
    await expectActive(trigger, option("Text message"))

    await visit(page, "components-select--basic")
    await combobox(page).focus()
    await page.keyboard.press("Enter")
    await page.keyboard.press("p")
    await expectActive(combobox(page), option("Phone"))
  })

  test("a single select chooses, closes and ignores a disabled option", async ({
    page,
  }) => {
    await visit(page, "components-select--basic")
    const trigger = combobox(page)

    await trigger.click()
    await listbox(page)
      .getByRole("option", { name: "Post" })
      .click({ force: true })
    await expectOpen(trigger, page)

    await listbox(page).getByRole("option", { name: "Phone" }).click()
    await expectClosed(trigger, page)
    await expect(trigger).toHaveText("Phone")
    await expect(trigger).toBeFocused()

    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("Enter")
    await expectClosed(trigger, page)
    await expect(trigger).toHaveText("Text message")
  })

  test("a multiple select stays open and respects max", async ({ page }) => {
    await visit(page, "components-select--multiple")
    const trigger = combobox(page, "Contact methods")
    const option = (name: string) => listbox(page).getByRole("option", { name })

    await expect(trigger).toHaveText("Email / Phone")
    await trigger.click()
    await expectOpen(trigger, page)
    await expect(option("Text message")).toHaveAttribute(
      "aria-disabled",
      "true",
    )

    await option("Email").click()
    await expectOpen(trigger, page)
    await expect(trigger).toHaveText("Phone")
    await expect(option("Text message")).not.toHaveAttribute(
      "aria-disabled",
      "true",
    )

    await option("Text message").click()
    await expect(trigger).toHaveText("Phone / Text message")
    await expect(option("Email")).toHaveAttribute("aria-disabled", "true")
    await expectOpen(trigger, page)
  })

  test("the clear button empties the value and returns focus", async ({
    page,
  }) => {
    await visit(page, "components-select--clearable")
    const trigger = combobox(page)

    await expect(trigger).toHaveText("Text message")
    await page.getByRole("button", { name: "Clear selection" }).click()
    await expect(trigger).toHaveText("Choose a contact method")
    await expect(
      page.getByRole("button", { name: "Clear selection" }),
    ).toHaveCount(0)
    await expect(trigger).toBeFocused()
  })
})

test.describe("Select states", () => {
  test("disabled does not open or take focus", async ({ page }) => {
    await visit(page, "components-select--disabled")
    const trigger = combobox(page)

    await expect(trigger).toBeDisabled()
    await trigger.click({ force: true })
    await expectClosed(trigger, page)
    await page.keyboard.press("Tab")
    await expect(trigger).not.toBeFocused()
  })

  test("read-only is focusable but never opens or changes", async ({
    page,
  }) => {
    await visit(page, "components-select--read-only")
    const trigger = combobox(page)

    await trigger.focus()
    await expect(trigger).toBeFocused()
    await expect(trigger).toHaveAttribute("aria-readonly", "true")
    for (const key of ["Enter", " ", "ArrowDown", "p"]) {
      await page.keyboard.press(key)
      await expectClosed(trigger, page)
    }
    await trigger.click()
    await expectClosed(trigger, page)
    await expect(trigger).toHaveText("Email")
  })

  test("invalid is wired to its label, error and dashed border", async ({
    page,
  }) => {
    await visit(page, "components-select--invalid")
    const trigger = combobox(page)

    await expect(trigger).toHaveAttribute("aria-invalid", "true")
    await expect(trigger).toHaveAttribute("aria-required", "true")
    await expect(trigger).toHaveAccessibleDescription(
      /Choose a contact method\./,
    )
    expect(await owned(trigger, "border-top-style")).toBe("dashed")
  })

  test("required shows a message after submit and focuses the first invalid", async ({
    page,
  }) => {
    await visit(page, "components-select--sizes", { args: "required:!true" })
    // The stories have no form: move the three selects into one.
    await page.evaluate(() => {
      const form = document.createElement("form")
      form.id = "qa-form"
      const roots = [...document.querySelectorAll("[role=combobox]")].map(
        (el) => el.parentElement!,
      )
      roots[0]!.before(form)
      form.append(...roots)
    })
    const first = combobox(page, "Contact method (sm)")
    const last = combobox(page, "Contact method (lg)")
    await expect(first).toHaveAttribute("aria-required", "true")

    await page.evaluate(() =>
      (document.getElementById("qa-form") as HTMLFormElement).requestSubmit(),
    )
    await expect(first).toBeFocused()
    await expect(first).toHaveAttribute("aria-invalid", "true")
    await expect(first).toHaveAccessibleDescription("Select an option.")
    await expect(last).toHaveAttribute("aria-invalid", "true")
    await expect(page.getByText("Select an option.")).toHaveCount(3)

    await first.click()
    await listbox(page).getByRole("option", { name: "Email" }).click()
    await expect(first).not.toHaveAttribute("aria-invalid", "true")
    await expect(page.getByText("Select an option.")).toHaveCount(2)
  })
})

test.describe("Select popover", () => {
  test("opens below the trigger with its width as the minimum", async ({
    page,
  }) => {
    await visit(page, "components-select--basic")
    const trigger = combobox(page)
    await trigger.click()
    await expectOpen(trigger, page)

    const triggerBox = await trigger.boundingBox()
    const panelBox = await listbox(page).boundingBox()
    if (!triggerBox || !panelBox) throw new Error("missing box")
    await expect(listbox(page)).toHaveAttribute("data-placement", "below")
    expect(panelBox.y).toBeGreaterThanOrEqual(triggerBox.y + triggerBox.height)
    expect(panelBox.width).toBeGreaterThanOrEqual(triggerBox.width - 1)
    expect(Math.abs(panelBox.x - triggerBox.x)).toBeLessThanOrEqual(1)
  })

  test("flips above near the bottom of the viewport", async ({ page }) => {
    await visit(page, "components-select--long-list")
    const trigger = combobox(page, "Time slot")
    await page.evaluate(() => {
      document.body.style.paddingTop = `${window.innerHeight - 90}px`
    })
    await trigger.scrollIntoViewIfNeeded()
    await trigger.click()
    await expectOpen(trigger, page)

    await expect(listbox(page)).toHaveAttribute("data-placement", "above")
    const triggerBox = await trigger.boundingBox()
    const panelBox = await listbox(page).boundingBox()
    if (!triggerBox || !panelBox) throw new Error("missing box")
    expect(panelBox.y + panelBox.height).toBeLessThanOrEqual(triggerBox.y + 1)
    expect(panelBox.y).toBeGreaterThanOrEqual(0)
  })

  test("scrolls the active option into view in a long list", async ({
    page,
  }) => {
    await visit(page, "components-select--long-list")
    const trigger = combobox(page, "Time slot")
    await trigger.focus()
    await page.keyboard.press("Enter")
    await page.keyboard.press("End")

    const last = listbox(page).getByRole("option", { name: "23:30" })
    await expectActive(trigger, last)
    const inside = await last.evaluate((el) => {
      const panel = el.closest("[role=listbox]")!.getBoundingClientRect()
      const box = el.getBoundingClientRect()
      return box.top >= panel.top - 1 && box.bottom <= panel.bottom + 1
    })
    expect(inside).toBe(true)
  })
})

test.describe("Select modes", () => {
  for (const mode of modes)
    test(`open states take their colors from the theme in ${mode} mode`, async ({
      page,
    }, testInfo) => {
      const project = testInfo.project.name
      await visit(page, "components-select--basic", { mode })
      const trigger = combobox(page)
      await trigger.click()
      await listbox(page).getByRole("option", { name: "Phone" }).click()
      await trigger.click()
      await expectOpen(trigger, page)
      await page.keyboard.press("ArrowDown")

      await expectTokens(page, listbox(page), [
        ["background-color", "--colors-bg-panel"],
        ["border-top-color", "--colors-border-emphasized"],
      ])
      // Phone is selected, then the active row moves to Text message.
      const selected = listbox(page).getByRole("option", { name: "Phone" })
      const active = listbox(page).getByRole("option", {
        name: "Text message",
      })
      await expectActive(trigger, active)
      await expectTokens(page, selected, [["color", "--colors-primary-fg"]])
      expect(await owned(selected, "background-color")).toBe("rgba(0, 0, 0, 0)")
      await expectTokens(page, active, [
        ["background-color", "--colors-bg-emphasized"],
      ])
      expect(await owned(active, "color")).not.toBe(
        await tokenColor(page, "--colors-primary-fg"),
      )
      await expect(selected.locator("[data-part=check]")).toBeVisible()

      // Selected and active together: the tint, not the plain active gray.
      await page.keyboard.press("ArrowUp")
      await expectActive(trigger, selected)
      await expectTokens(page, selected, [
        ["background-color", "--colors-primary-subtle"],
        ["color", "--colors-primary-fg"],
      ])
      expect(await owned(selected, "background-color")).not.toBe(
        await tokenColor(page, "--colors-bg-emphasized"),
      )
      await page.screenshot({
        path: join(shots, `select-selected-active-${mode}-${project}.png`),
      })
      await page.keyboard.press("ArrowDown")
      await page.screenshot({
        path: join(shots, `select-basic-open-${mode}-${project}.png`),
      })

      await visit(page, "components-select--groups", { mode })
      await combobox(page).click()
      await page.screenshot({
        path: join(shots, `select-groups-open-${mode}-${project}.png`),
      })

      await visit(page, "components-select--multiple", { mode })
      await combobox(page, "Contact methods").click()
      await page.screenshot({
        path: join(shots, `select-multiple-open-${mode}-${project}.png`),
      })
    })
})

test.describe("Select accessibility", () => {
  for (const id of [
    "basic",
    "groups",
    "multiple",
    "clearable",
    "invalid",
    "in-field",
    "long-list",
  ])
    for (const mode of modes)
      test(`${id} has no axe violations closed and open in ${mode} mode`, async ({
        page,
        scan,
      }) => {
        await visit(page, `components-select--${id}`, { mode })
        expect(await scan(), "closed").toEqual([])

        await page.getByRole("combobox").first().click()
        await expect(listbox(page)).toBeVisible()
        expect(await scan(), "open").toEqual([])
      })
})
