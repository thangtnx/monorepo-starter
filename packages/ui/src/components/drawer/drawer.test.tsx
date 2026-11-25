import { fireEvent } from "@testing-library/react"
import { useState } from "react"
import { a11y, render, screen } from "#test"
import { Button } from "../button"
import { Drawer } from "./index"

function ExampleDrawer({
  size,
  defaultOpen = false,
  placement,
}: {
  defaultOpen?: boolean
  placement?: "bottom" | "end" | "start" | "top"
  size?: "full" | "lg" | "md" | "sm" | "xl" | "xs"
}) {
  return (
    <Drawer.Root size={size} defaultOpen={defaultOpen} placement={placement}>
      <Drawer.Trigger>
        <Button>Open drawer</Button>
      </Drawer.Trigger>
      <DialogFallbackOrDrawerBody />
    </Drawer.Root>
  )
}

function DialogFallbackOrDrawerBody() {
  return (
    <Drawer.Content>
      <Drawer.CloseButton />
      <Drawer.Header>
        <Drawer.Title>Navigation</Drawer.Title>
        <Drawer.Description>
          Quick links and workspace settings.
        </Drawer.Description>
      </Drawer.Header>
      <Drawer.Body>Drawer content</Drawer.Body>
      <Drawer.Footer>
        <Button variant="outline">Done</Button>
      </Drawer.Footer>
    </Drawer.Content>
  )
}

describe("<Drawer />", () => {
  test("opens via trigger, applies placement/size attributes, and restores focus on close", async () => {
    const { user } = render(<ExampleDrawer size="lg" placement="start" />)
    const trigger = screen.getByRole("button", { name: "Open drawer" })

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    await user.click(trigger)

    const drawer = screen.getByRole("dialog", { name: "Navigation" })
    expect(drawer).toHaveAttribute("data-placement", "start")
    expect(drawer).toHaveAttribute("data-size", "lg")
    expect(drawer).toHaveAccessibleDescription(
      "Quick links and workspace settings.",
    )

    await user.click(screen.getByRole("button", { name: "Close" }))
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  test("supports all placements, Escape key, and backdrop click", async () => {
    for (const placement of ["start", "end", "top", "bottom"] as const) {
      const view = render(<ExampleDrawer defaultOpen placement={placement} />)
      expect(view.getByRole("dialog")).toHaveAttribute(
        "data-placement",
        placement,
      )
      view.unmount()
    }

    const { user } = render(<ExampleDrawer defaultOpen />)
    await user.keyboard("{Escape}")
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()

    render(<ExampleDrawer defaultOpen />)
    fireEvent.click(screen.getByRole("dialog"))
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  test("supports controlled state", async () => {
    function Controlled() {
      const [open, setOpen] = useState(false)
      return (
        <>
          <Button onClick={() => setOpen(true)}>Toggle drawer</Button>
          <Drawer.Root open={open} onOpenChange={setOpen}>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>Controlled Drawer</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>Body</Drawer.Body>
              <Drawer.Footer>
                <Button onClick={() => setOpen(false)}>Close Drawer</Button>
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer.Root>
        </>
      )
    }

    const { user } = render(<Controlled />)
    await user.click(screen.getByRole("button", { name: "Toggle drawer" }))
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Close Drawer" }))
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  test("has no accessibility violations when open", async () => {
    const { container } = render(<ExampleDrawer defaultOpen />)
    await a11y(container)
  })
})
