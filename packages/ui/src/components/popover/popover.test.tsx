import { fireEvent } from "@testing-library/react"
import { useState } from "react"
import { a11y, render, screen } from "#test"
import { Button } from "../button"
import { Popover } from "./index"

function ExamplePopover({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <Popover.Root defaultOpen={defaultOpen}>
      <Popover.Trigger>
        <Button>Toggle details</Button>
      </Popover.Trigger>
      <Popover.Content aria-label="Workspace info">
        <Popover.CloseButton />
        <Popover.Header>Workspace quota</Popover.Header>
        <Popover.Body>
          4.2 GB of 10 GB used across active projects.
        </Popover.Body>
        <Popover.Footer>
          <Button variant="outline">Upgrade</Button>
        </Popover.Footer>
      </Popover.Content>
    </Popover.Root>
  )
}

describe("<Popover />", () => {
  test("toggles via trigger, closes via close button, Escape, and outside pointer", async () => {
    const { user } = render(<ExamplePopover />)
    const trigger = screen.getByRole("button", { name: "Toggle details" })

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    expect(trigger).toHaveAttribute("aria-expanded", "false")

    await user.click(trigger)
    expect(
      screen.getByRole("dialog", { name: "Workspace info" }),
    ).toBeInTheDocument()
    expect(trigger).toHaveAttribute("aria-expanded", "true")

    await user.click(screen.getByRole("button", { name: "Close" }))
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()

    await user.click(trigger)
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    fireEvent.keyDown(document, { key: "Escape" })
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()

    await user.click(trigger)
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    fireEvent.pointerDown(document.body)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  test("supports controlled open state", async () => {
    function Controlled() {
      const [open, setOpen] = useState(false)
      return (
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger>
            <Button>Controlled</Button>
          </Popover.Trigger>
          <Popover.Content aria-label="Controlled popover">
            <Popover.Body>Managed state</Popover.Body>
          </Popover.Content>
        </Popover.Root>
      )
    }

    const { user } = render(<Controlled />)
    await user.click(screen.getByRole("button", { name: "Controlled" }))
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Controlled" }))
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  test("has no accessibility violations when open", async () => {
    const { container } = render(<ExamplePopover defaultOpen />)
    await a11y(container)
  })
})
