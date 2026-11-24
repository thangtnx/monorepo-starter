import { a11y, render, screen } from "#test"
import { Link } from "./link"

describe("<Link />", () => {
  test("renders a relative destination as a native link", () => {
    render(<Link href="/settings">Settings</Link>)

    const link = screen.getByRole("link", { name: "Settings" })
    expect(link).toHaveAttribute("href", "/settings")
    expect(link).not.toHaveAttribute("rel")
    expect(link).not.toHaveTextContent("↗")
  })

  test.each(["https://example.com/help", "//example.com/help"])(
    "marks and protects the external destination %s",
    (href) => {
      render(
        <Link href={href} rel="nofollow opener">
          Help
        </Link>,
      )

      const link = screen.getByRole("link", { name: "Help" })
      expect(link).toHaveAccessibleDescription("External link")
      expect(link).toHaveAttribute("rel", "nofollow noopener noreferrer")
      expect(link).not.toHaveAttribute("target")
      expect(screen.getByText(/↗/)).toHaveAttribute("aria-hidden", "true")
      expect(screen.getByText(/↗/)).toHaveAttribute(
        "data-part",
        "external-indicator",
      )
    },
  )

  test("allows callers to classify destinations explicitly", () => {
    render(
      <>
        <Link href="https://example.com/settings" external={false}>
          Settings
        </Link>
        <Link href="/handoff" external>
          Help
        </Link>
      </>,
    )

    expect(screen.getByRole("link", { name: "Settings" })).not.toHaveAttribute(
      "rel",
    )
    expect(screen.getByRole("link", { name: "Help" })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    )
  })

  test("keeps a supplied name and description alongside the external cue", () => {
    render(
      <>
        <p id="help-details">Product documentation</p>
        <Link
          href="https://example.com"
          aria-describedby="help-details"
          aria-label="Help center"
          externalLabel="Opens an external site"
        >
          Help
        </Link>
      </>,
    )

    expect(
      screen.getByRole("link", { name: "Help center" }),
    ).toHaveAccessibleDescription(
      "Product documentation Opens an external site",
    )
  })

  test("protects a local link opened in a new tab", () => {
    render(
      <Link href="/settings" target="_blank">
        Settings
      </Link>,
    )

    const link = screen.getByRole("link", { name: "Settings" })
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
  })

  test("supports underline, plain, subtle, and none variants", () => {
    render(
      <>
        <Link href="/a">Default</Link>
        <Link href="/b" variant="plain">
          Plain
        </Link>
        <Link href="/c" variant="subtle">
          Subtle
        </Link>
        <Link href="/d" variant="none">
          None
        </Link>
      </>,
    )

    expect(screen.getByRole("link", { name: "Default" })).toHaveAttribute(
      "data-variant",
      "underline",
    )
    expect(screen.getByRole("link", { name: "Plain" })).toHaveAttribute(
      "data-variant",
      "plain",
    )
    expect(screen.getByRole("link", { name: "Subtle" })).toHaveAttribute(
      "data-variant",
      "subtle",
    )
    expect(screen.getByRole("link", { name: "None" })).toHaveAttribute(
      "data-variant",
      "none",
    )
  })

  test("has no accessibility violations", async () => {
    await a11y(<Link href="https://example.com">Help</Link>)
  })
})
