import { fireEvent } from "@testing-library/react"
import { a11y, render, screen } from "#test"
import { Button } from "../button"
import { Menu } from "./index"

describe("<Menu />", () => {
  test("navigates items with ArrowDown/ArrowUp/Home/End skipping disabled items and triggers onSelect", async () => {
    const onDuplicate = vi.fn()
    const { user } = render(
      <Menu.Root>
        <Menu.Trigger>
          <Button>Actions</Button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Item command="⌘C">Copy</Menu.Item>
          <Menu.Item disabled>Archive</Menu.Item>
          <Menu.Item onSelect={onDuplicate}>Duplicate</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
    )

    const trigger = screen.getByRole("button", { name: "Actions" })
    trigger.focus()
    await user.keyboard("{ArrowDown}")

    expect(screen.getByRole("menu", { name: "Actions" })).toBeInTheDocument()
    const copy = screen.getByRole("menuitem", { name: /Copy/ })
    const duplicate = screen.getByRole("menuitem", { name: "Duplicate" })
    expect(copy).toHaveFocus()

    await user.keyboard("{ArrowDown}")
    // Disabled "Archive" is skipped.
    expect(duplicate).toHaveFocus()

    await user.keyboard("{Home}")
    expect(copy).toHaveFocus()
    await user.keyboard("{End}")
    expect(duplicate).toHaveFocus()

    await user.keyboard("{Enter}")
    expect(onDuplicate).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole("menu")).not.toBeInTheDocument()
  })

  test("toggles checkbox and radio items and restores focus on Escape", async () => {
    const onSortChange = vi.fn()
    const { user } = render(
      <Menu.Root closeOnSelect={false}>
        <Menu.Trigger>
          <Button>View</Button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Label>Panels</Menu.Label>
          <Menu.CheckboxItem defaultChecked>Sidebar</Menu.CheckboxItem>
          <Menu.Separator />
          <Menu.RadioGroup defaultValue="name" onValueChange={onSortChange}>
            <Menu.RadioItem value="name">Sort by name</Menu.RadioItem>
            <Menu.RadioItem value="date">Sort by date</Menu.RadioItem>
          </Menu.RadioGroup>
        </Menu.Content>
      </Menu.Root>,
    )

    const trigger = screen.getByRole("button", { name: "View" })
    await user.click(trigger)

    const sidebar = screen.getByRole("menuitemcheckbox", { name: "Sidebar" })
    expect(sidebar).toHaveAttribute("aria-checked", "true")
    await user.click(sidebar)
    expect(sidebar).toHaveAttribute("aria-checked", "false")

    const byDate = screen.getByRole("menuitemradio", { name: "Sort by date" })
    await user.click(byDate)
    expect(onSortChange).toHaveBeenCalledWith("date")
    expect(byDate).toHaveAttribute("aria-checked", "true")
    expect(
      screen.getByRole("menuitemradio", { name: "Sort by name" }),
    ).toHaveAttribute("aria-checked", "false")

    fireEvent.keyDown(document, { key: "Escape" })
    expect(screen.queryByRole("menu")).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  test("has no accessibility violations when open", async () => {
    const { container } = render(
      <Menu.Root defaultOpen>
        <Menu.Trigger>
          <Button>Options</Button>
        </Menu.Trigger>
        <Menu.Content>
          <Menu.Label>Edit</Menu.Label>
          <Menu.Item>Rename</Menu.Item>
          <Menu.Separator />
          <Menu.Item>Delete</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
    )
    await a11y(container)
  })
})
