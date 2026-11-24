import type { RenderOptions } from "@testing-library/react"
import type { ReactElement } from "react"
import type { AxeCore } from "vitest-axe"
import { render as renderElement } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { axe } from "vitest-axe"

/** Renders the element and returns a `user` for interactions. */
export const render = (ui: ReactElement, options?: RenderOptions) => ({
  user: userEvent.setup(),
  ...renderElement(ui, options),
})

/** Fails the test when axe finds accessibility violations. */
export async function a11y(
  ui: HTMLElement | ReactElement,
  options?: AxeCore.RunOptions,
) {
  const container = ui instanceof HTMLElement ? ui : render(ui).container
  const results = await axe(container, options)

  expect(results.violations).toStrictEqual([])
}
