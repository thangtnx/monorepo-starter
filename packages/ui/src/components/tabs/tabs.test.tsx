import { useState } from "react"
import { a11y, render, screen } from "#test"
import { Tabs } from "."

function DemoTabs(props: Tabs.RootProps) {
  return (
    <Tabs.Root defaultValue="account" {...props}>
      <Tabs.List aria-label="Account sections">
        <Tabs.Tab value="account">Account</Tabs.Tab>
        <Tabs.Tab value="security">Security</Tabs.Tab>
        <Tabs.Tab value="billing">Billing</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panels>
        <Tabs.Panel value="account">Account settings content</Tabs.Panel>
        <Tabs.Panel value="security">Security settings content</Tabs.Panel>
        <Tabs.Panel value="billing">Billing settings content</Tabs.Panel>
      </Tabs.Panels>
    </Tabs.Root>
  )
}

describe("<Tabs />", () => {
  test("wires ARIA roles, relationships, and default selection", () => {
    render(<DemoTabs />)

    const tablist = screen.getByRole("tablist", { name: "Account sections" })
    const accountTab = screen.getByRole("tab", { name: "Account" })
    const securityTab = screen.getByRole("tab", { name: "Security" })
    const accountPanel = screen.getByRole("tabpanel", { name: "Account" })

    expect(tablist).toHaveAttribute("aria-orientation", "horizontal")
    expect(accountTab).toHaveAttribute("aria-selected", "true")
    expect(accountTab).toHaveAttribute("tabindex", "0")
    expect(securityTab).toHaveAttribute("aria-selected", "false")
    expect(securityTab).toHaveAttribute("tabindex", "-1")
    expect(accountPanel).toBeVisible()
    expect(accountTab).toHaveAttribute("aria-controls", accountPanel.id)
    expect(accountPanel).toHaveAttribute("aria-labelledby", accountTab.id)
    expect(
      screen
        .getByText("Security settings content")
        .closest('[role="tabpanel"]'),
    ).toHaveAttribute("hidden")
  })

  test("selects the first enabled tab when no defaultValue is given", () => {
    render(
      <Tabs.Root>
        <Tabs.List aria-label="Options">
          <Tabs.Tab disabled value="first">
            First
          </Tabs.Tab>
          <Tabs.Tab value="second">Second</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel value="first">First content</Tabs.Panel>
          <Tabs.Panel value="second">Second content</Tabs.Panel>
        </Tabs.Panels>
      </Tabs.Root>,
    )

    expect(screen.getByRole("tab", { name: "Second" })).toHaveAttribute(
      "aria-selected",
      "true",
    )
    expect(screen.getByRole("tabpanel", { name: "Second" })).toBeVisible()
  })

  test("switches tabs on click", async () => {
    const { user } = render(<DemoTabs />)

    await user.click(screen.getByRole("tab", { name: "Security" }))

    expect(screen.getByRole("tab", { name: "Security" })).toHaveAttribute(
      "aria-selected",
      "true",
    )
    expect(screen.getByRole("tab", { name: "Account" })).toHaveAttribute(
      "aria-selected",
      "false",
    )
    expect(screen.getByRole("tabpanel", { name: "Security" })).toBeVisible()
  })

  test("navigates horizontally with arrow, Home, and End keys and skips disabled tabs", async () => {
    const { user } = render(
      <Tabs.Root defaultValue="account">
        <Tabs.List aria-label="Account sections">
          <Tabs.Tab value="account">Account</Tabs.Tab>
          <Tabs.Tab disabled value="disabled">
            Locked
          </Tabs.Tab>
          <Tabs.Tab value="security">Security</Tabs.Tab>
          <Tabs.Tab value="billing">Billing</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel value="account">Account settings</Tabs.Panel>
          <Tabs.Panel value="disabled">Locked settings</Tabs.Panel>
          <Tabs.Panel value="security">Security settings</Tabs.Panel>
          <Tabs.Panel value="billing">Billing settings</Tabs.Panel>
        </Tabs.Panels>
      </Tabs.Root>,
    )

    await user.tab()
    expect(screen.getByRole("tab", { name: "Account" })).toHaveFocus()

    await user.keyboard("{ArrowRight}")
    expect(screen.getByRole("tab", { name: "Security" })).toHaveFocus()
    expect(screen.getByRole("tab", { name: "Security" })).toHaveAttribute(
      "aria-selected",
      "true",
    )

    await user.keyboard("{End}")
    expect(screen.getByRole("tab", { name: "Billing" })).toHaveFocus()

    await user.keyboard("{ArrowRight}")
    expect(screen.getByRole("tab", { name: "Account" })).toHaveFocus()

    await user.keyboard("{ArrowLeft}")
    expect(screen.getByRole("tab", { name: "Billing" })).toHaveFocus()

    await user.keyboard("{Home}")
    expect(screen.getByRole("tab", { name: "Account" })).toHaveFocus()
  })

  test("navigates vertically with ArrowDown and ArrowUp", async () => {
    const { user } = render(<DemoTabs orientation="vertical" />)

    expect(screen.getByRole("tablist")).toHaveAttribute(
      "aria-orientation",
      "vertical",
    )

    await user.tab()
    await user.keyboard("{ArrowDown}")
    expect(screen.getByRole("tab", { name: "Security" })).toHaveFocus()
    expect(screen.getByRole("tab", { name: "Security" })).toHaveAttribute(
      "aria-selected",
      "true",
    )

    await user.keyboard("{ArrowUp}")
    expect(screen.getByRole("tab", { name: "Account" })).toHaveFocus()
    expect(screen.getByRole("tab", { name: "Account" })).toHaveAttribute(
      "aria-selected",
      "true",
    )
  })

  test("supports manual activation without activating on arrow keys", async () => {
    const { user } = render(<DemoTabs manual />)

    await user.tab()
    await user.keyboard("{ArrowRight}")

    expect(screen.getByRole("tab", { name: "Security" })).toHaveFocus()
    expect(screen.getByRole("tab", { name: "Account" })).toHaveAttribute(
      "aria-selected",
      "true",
    )
    expect(screen.getByRole("tab", { name: "Security" })).toHaveAttribute(
      "aria-selected",
      "false",
    )

    await user.keyboard("{Enter}")
    expect(screen.getByRole("tab", { name: "Security" })).toHaveAttribute(
      "aria-selected",
      "true",
    )
    expect(screen.getByRole("tabpanel", { name: "Security" })).toBeVisible()
  })

  test("supports controlled value and onValueChange", async () => {
    const onValueChange = vi.fn()
    function Controlled() {
      const [value, setValue] = useState("account")
      return (
        <DemoTabs
          value={value}
          onValueChange={(next) => {
            onValueChange(next)
            setValue(next)
          }}
        />
      )
    }

    const { user } = render(<Controlled />)
    await user.click(screen.getByRole("tab", { name: "Billing" }))

    expect(onValueChange).toHaveBeenCalledWith("billing")
    expect(screen.getByRole("tab", { name: "Billing" })).toHaveAttribute(
      "aria-selected",
      "true",
    )
    expect(screen.getByRole("tabpanel", { name: "Billing" })).toBeVisible()
  })

  test("respects lazy and keepMounted={false} panel mounting", async () => {
    const { rerender, user } = render(<DemoTabs lazy />)

    expect(
      screen.queryByText("Security settings content"),
    ).not.toBeInTheDocument()

    await user.click(screen.getByRole("tab", { name: "Security" }))
    expect(screen.getByText("Security settings content")).toBeVisible()

    await user.click(screen.getByRole("tab", { name: "Account" }))
    expect(screen.getByText("Security settings content")).toBeInTheDocument()

    rerender(<DemoTabs keepMounted={false} />)
    expect(
      screen.queryByText("Security settings content"),
    ).not.toBeInTheDocument()
  })

  test("passes axe accessibility checks", async () => {
    await a11y(<DemoTabs />)
  })
})
