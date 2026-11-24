import type { MouseEventHandler } from "react"
import type { ComponentStyleProps, ThemeProps } from "./define"
import { createRef } from "react"
import { a11y, render } from "#test"
import { createComponent, createSlotComponent } from "./create-component"
import { defineComponentSlotStyle, defineComponentStyle } from "./define"

const controlStyle = defineComponentStyle({
  compounds: [{ css: { opacity: 1 }, rank: [0, 1] }],
  props: { fullWidth: { true: {} } },
  sizes: { sm: {}, md: {} },
  variants: { plain: {}, solid: {} },
  defaultProps: { colorScheme: "primary", size: "sm", variant: "plain" },
})

const control = createComponent<
  {
    className?: string
    title?: string
    onClick?: MouseEventHandler<HTMLButtonElement>
  },
  typeof controlStyle,
  { label: string }
>("control", controlStyle)

const Control = control.withContext("button")(
  { title: "Initial" },
  ({ title, ...props }) => ({ ...props, title: `${title} first` }),
  ({ title, ...props }) => ({ ...props, title: `${title} second` }),
)
const RawControl = control.component("button")({ type: "button" })

function ControlLabel() {
  const context = control.useComponentContext()
  const defaults = control.usePropsContext()
  return (
    <>
      {context?.label} {defaults?.variant}
    </>
  )
}

const panelStyle = defineComponentSlotStyle({
  base: { label: { display: "inline" }, root: { display: "block" } },
  compounds: [{ css: { icon: { opacity: 1 } }, alignment: "start" }],
  props: { emphasized: { false: {}, true: {} } },
  sizes: { sm: {}, lg: {} },
  variants: { plain: {}, solid: {} },
  defaultProps: {
    label: { size: "lg" },
    root: { size: "sm", variant: "plain", emphasized: false },
  },
})
const panel = createSlotComponent<
  { title?: string },
  typeof panelStyle,
  string
>("panel", panelStyle)
const Panel = panel.withProvider("section")()
const PanelLabel = panel.withContext("span", "label")()
const PanelIcon = panel.withContext("span", "icon")()
const RawPanelLabel = panel.component("span", "label")()

function PanelState() {
  const styles = panel.useStyleContext()
  return (
    <output>
      {panel.useComponentContext()} {styles?.root?.["data-variant"]}/
      {styles?.label?.["data-size"]}
    </output>
  )
}

describe("createComponent", () => {
  test("resolves recipe props and applies transforms with explicit props taking precedence", async () => {
    const defaultClick = vi.fn()
    const explicitClick = vi.fn()
    const { container, getByRole } = render(
      <control.PropsContext
        value={{
          className: "context",
          variant: "solid",
          title: "Context",
          onClick: defaultClick,
        }}
      >
        <control.ComponentContext value={{ label: "Action" }}>
          <Control
            className="explicit"
            variant="plain"
            fullWidth
            rank={0}
            title="Explicit"
            onClick={explicitClick}
          >
            <ControlLabel />
          </Control>
        </control.ComponentContext>
      </control.PropsContext>,
    )

    const button = getByRole("button", { name: "Action solid" })
    expect(button).toHaveClass("ui-control", "context", "explicit")
    expect(button).toHaveAttribute("title", "Explicit first second")
    expect(button).toHaveAttribute("data-variant", "plain")
    expect(button).toHaveAttribute("data-size", "sm")
    expect(button).toHaveAttribute("data-scheme", "primary")
    expect(button).toHaveAttribute("data-full-width", "true")
    expect(button).toHaveAttribute("data-rank", "0")
    expect(button).not.toHaveAttribute("variant")
    expect(button).not.toHaveAttribute("rank")
    button.click()
    expect(defaultClick).toHaveBeenCalledBefore(explicitClick)
    await a11y(container)
  })

  test("renders as another element and keeps its own ref and native props", async () => {
    const ref = createRef<HTMLAnchorElement>()
    const cleanup = vi.fn()
    const { container, getByRole, unmount } = render(
      <control.PropsContext value={{ variant: "solid" }}>
        <Control
          ref={(node) => {
            ref.current = node
            return cleanup
          }}
          as="a"
          href="#destination"
        >
          Destination
        </Control>
      </control.PropsContext>,
    )
    const link = getByRole("link", { name: "Destination" })
    expect(link).toBe(ref.current)
    expect(link).toHaveAttribute("href", "#destination")
    expect(link).toHaveAttribute("data-variant", "solid")
    expect(link).not.toHaveAttribute("as")
    await a11y(container)
    unmount()
    expect(cleanup).toHaveBeenCalledTimes(1)
  })

  test("renders a class-only component and supports function initializers", async () => {
    const Initialized = control.withContext("button")((props) => ({
      ...props,
      variant: "solid",
    }))
    const { container, getByRole } = render(
      <control.PropsContext value={{ title: "Context" }}>
        <RawControl>Raw</RawControl>
        <Initialized>Initialized</Initialized>
      </control.PropsContext>,
    )
    const raw = getByRole("button", { name: "Raw" })
    expect(raw).toHaveClass("ui-control")
    expect(raw).toHaveAttribute("type", "button")
    expect(raw).not.toHaveAttribute("data-size")
    const initialized = getByRole("button", { name: "Initialized" })
    expect(initialized).toHaveAttribute("title", "Context")
    expect(initialized).toHaveAttribute("data-variant", "solid")
    await a11y(container)
  })
})

describe("createSlotComponent", () => {
  test("resolves provider and slot defaults for each instance", async () => {
    const { container, getByRole, getByText } = render(
      <panel.PropsContext value={{ title: "Context title" }}>
        <panel.ComponentContext value="state">
          <Panel
            variant="solid"
            aria-label="Outer"
            alignment="start"
            emphasized
          >
            <PanelLabel>Outer label</PanelLabel>
            <PanelIcon>Outer icon</PanelIcon>
            <PanelState />
            <Panel size="sm" aria-label="Inner">
              <PanelLabel>Inner label</PanelLabel>
              <PanelState />
            </Panel>
          </Panel>
        </panel.ComponentContext>
      </panel.PropsContext>,
    )
    const outer = getByRole("region", { name: "Outer" })
    const inner = getByRole("region", { name: "Inner" })
    const label = getByText("Outer label")

    expect(outer).toHaveClass("ui-panel")
    expect(outer).toHaveAttribute("title", "Context title")
    expect(outer).toHaveAttribute("data-size", "sm")
    expect(label).toHaveClass("ui-panel__label")
    expect(label).toHaveAttribute("data-variant", "solid")
    expect(label).toHaveAttribute("data-size", "lg")
    expect(label).toHaveAttribute("data-emphasized", "true")
    expect(label).not.toHaveAttribute("title")
    expect(getByText("Outer icon")).toHaveAttribute("data-alignment", "start")
    expect(inner).toHaveAttribute("data-variant", "plain")
    const innerLabel = getByText("Inner label")
    expect(innerLabel).toHaveAttribute("data-variant", "plain")
    expect(innerLabel).toHaveAttribute("data-size", "sm")
    expect(innerLabel).toHaveAttribute("data-emphasized", "false")
    expect(innerLabel).not.toHaveAttribute("data-alignment")
    expect(getByText("state solid/lg")).toBeInTheDocument()
    expect(getByText("state plain/sm")).toBeInTheDocument()
    await a11y(container)
  })

  test("supports standalone slots, raw slots and alternate provider elements", async () => {
    const { container, getByRole, getByText } = render(
      <>
        <PanelLabel>Standalone</PanelLabel>
        <Panel as="article" variant="solid" aria-label="Panel">
          <RawPanelLabel>Raw label</RawPanelLabel>
        </Panel>
      </>,
    )
    expect(getByText("Standalone")).toHaveClass("ui-panel__label")
    expect(getByText("Standalone")).not.toHaveAttribute("data-variant")
    expect(getByText("Raw label")).toHaveClass("ui-panel__label")
    expect(getByText("Raw label")).not.toHaveAttribute("data-variant")
    expect(getByRole("article", { name: "Panel" })).toHaveAttribute(
      "data-variant",
      "solid",
    )
    await a11y(container)
  })
})

describe("ThemeProps", () => {
  test("infers modifier and compound values and preserves the legacy type alias", () => {
    expectTypeOf<ThemeProps<typeof controlStyle>>().toEqualTypeOf<
      ComponentStyleProps<typeof controlStyle>
    >()
    expectTypeOf<ThemeProps<typeof controlStyle>["rank"]>().toEqualTypeOf<
      0 | 1 | undefined
    >()
    expectTypeOf<ThemeProps<typeof panelStyle>["size"]>().toEqualTypeOf<
      "lg" | "sm" | undefined
    >()
    expectTypeOf<ThemeProps<typeof panelStyle>["emphasized"]>().toEqualTypeOf<
      boolean | undefined
    >()
    expectTypeOf<ThemeProps<typeof panelStyle>["alignment"]>().toEqualTypeOf<
      "start" | undefined
    >()
  })
})
