import { fireEvent } from "@testing-library/react"
import { useRef, useState } from "react"
import { a11y, render, screen } from "#test"
import { Button } from "../button"
import { Dialog } from "./index"

function ExampleDialog({
  closeOnEsc = true,
  closeOnOverlayClick = true,
  defaultOpen = false,
}: {
  closeOnEsc?: boolean
  closeOnOverlayClick?: boolean
  defaultOpen?: boolean
}) {
  return (
    <Dialog.Root
      closeOnEsc={closeOnEsc}
      closeOnOverlayClick={closeOnOverlayClick}
      defaultOpen={defaultOpen}
    >
      <Dialog.Trigger>
        <Button>Open dialog</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.CloseButton />
        <Dialog.Header>
          <Dialog.Title>Delete item</Dialog.Title>
          <Dialog.Description>
            This action permanently removes the selected item.
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>Are you sure you want to continue?</Dialog.Body>
        <Dialog.Footer>
          <Button variant="outline">Cancel</Button>
          <Button colorScheme="danger">Delete</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}

describe("<Dialog />", () => {
  test("opens via trigger, links labels, locks scroll, and restores focus on close", async () => {
    const { user } = render(<ExampleDialog />)
    const trigger = screen.getByRole("button", { name: "Open dialog" })

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    expect(trigger).toHaveAttribute("aria-expanded", "false")
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog")

    await user.click(trigger)
    const dialog = screen.getByRole("dialog", { name: "Delete item" })
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveAccessibleDescription(
      "This action permanently removes the selected item.",
    )
    expect(trigger).toHaveAttribute("aria-expanded", "true")
    expect(document.documentElement.style.overflow).toBe("hidden")

    await user.click(screen.getByRole("button", { name: "Close" }))
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    expect(document.documentElement.style.overflow).toBe("")
    expect(trigger).toHaveFocus()
  })

  test("handles Escape key and closeOnEsc={false}", async () => {
    const { unmount, user } = render(<ExampleDialog defaultOpen />)
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    await user.keyboard("{Escape}")
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    unmount()

    const locked = render(<ExampleDialog closeOnEsc={false} defaultOpen />)
    const lockedDialog = locked.getByRole("dialog")
    fireEvent.keyDown(lockedDialog, { key: "Escape" })
    expect(locked.getByRole("dialog")).toBeInTheDocument()
  })

  test("handles backdrop click and closeOnOverlayClick={false}", () => {
    render(<ExampleDialog defaultOpen />)
    const dialog = screen.getByRole("dialog")

    // Clicking inside body should not close the dialog.
    fireEvent.click(screen.getByText("Are you sure you want to continue?"))
    expect(screen.getByRole("dialog")).toBeInTheDocument()

    // Clicking the backdrop element itself closes it.
    fireEvent.click(dialog)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()

    const { getByRole } = render(
      <ExampleDialog closeOnOverlayClick={false} defaultOpen />,
    )
    fireEvent.click(getByRole("dialog"))
    expect(getByRole("dialog")).toBeInTheDocument()
  })

  test("supports controlled open state and initialFocusRef / finalFocusRef", async () => {
    function Controlled() {
      const [open, setOpen] = useState(false)
      const confirmRef = useRef<HTMLButtonElement>(null)
      const returnRef = useRef<HTMLButtonElement>(null)

      return (
        <>
          <Button onClick={() => setOpen(true)}>Launch</Button>
          <Button ref={returnRef}>After close</Button>
          <Dialog.Root
            finalFocusRef={returnRef}
            initialFocusRef={confirmRef}
            open={open}
            onOpenChange={setOpen}
          >
            <Dialog.Content size="lg">
              <Dialog.Header>
                <Dialog.Title>Controlled</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>Body content</Dialog.Body>
              <Dialog.Footer>
                <Button ref={confirmRef} onClick={() => setOpen(false)}>
                  Confirm
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Root>
        </>
      )
    }

    const { user } = render(<Controlled />)
    await user.click(screen.getByRole("button", { name: "Launch" }))
    expect(screen.getByRole("dialog")).toHaveAttribute("data-size", "lg")
    expect(screen.getByRole("button", { name: "Confirm" })).toHaveFocus()

    await user.click(screen.getByRole("button", { name: "Confirm" }))
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: "After close" })).toHaveFocus()
  })

  test("has no accessibility violations when open", async () => {
    const { container } = render(<ExampleDialog defaultOpen />)
    await a11y(container)
  })
})
