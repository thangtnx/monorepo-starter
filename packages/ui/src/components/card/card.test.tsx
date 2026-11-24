import { a11y, render, screen } from "#test"
import { createCss } from "../../core"
import { theme } from "../../theme"
import { cardStyle } from "./card.style"
import { Card } from "./index"

const css = createCss(theme, { card: cardStyle })

const card = (
  <Card.Root aria-labelledby="summary-heading">
    <Card.Header>
      <h2 id="summary-heading">Summary</h2>
    </Card.Header>
    <Card.Body>
      <p>Three new messages.</p>
    </Card.Body>
    <Card.Footer>
      <a href="/messages">Read messages</a>
    </Card.Footer>
  </Card.Root>
)

describe("<Card />", () => {
  test("renders a named article with semantic parts and default styling", () => {
    render(card)

    const root = screen.getByRole("article", { name: "Summary" })
    expect(root.tagName).toBe("ARTICLE")
    expect(root).toHaveAttribute("data-variant", "panel")
    expect(root).toHaveAttribute("data-size", "md")
    expect(root).toHaveAttribute("data-scheme", "neutral")
    expect(root).not.toHaveAttribute("tabindex")
    const header = screen.getByRole("heading", {
      name: "Summary",
    }).parentElement
    const body = screen.getByRole("paragraph").parentElement
    const footer = screen.getByRole("link", {
      name: "Read messages",
    }).parentElement
    expect(header).toHaveClass("ui-card-header")
    expect(header?.tagName).toBe("HEADER")
    expect(body).toHaveClass("ui-card-body")
    expect(body?.tagName).toBe("DIV")
    expect(footer).toHaveClass("ui-card-footer")
    expect(footer?.tagName).toBe("FOOTER")
  })

  test.each([
    "elevated",
    "outline",
    "panel",
    "solid",
    "subtle",
    "surface",
  ] as const)("selects the %s variant and supplied scheme", (variant) => {
    render(<Card.Root colorScheme="primary" variant={variant} />)

    const root = screen.getByRole("article")
    expect(root).toHaveAttribute("data-variant", variant)
    expect(root).toHaveAttribute("data-scheme", "primary")
    expect(root).not.toHaveAttribute("style")
  })

  test.each([
    ["sm", "3", "2", "lg"],
    ["md", "4", "3", "xl"],
    ["lg", "6", "5", "2xl"],
  ] as const)(
    "compiles the %s part spacing and header font size",
    (size, space, block, font) => {
      render(<Card.Root size={size} />)

      expect(screen.getByRole("article")).toHaveAttribute("data-size", size)
      expect(css).toContain(
        `.ui-card[data-size="${size}"] {\n` +
          `    --card-header-font-size: var(--font-sizes-${font});\n` +
          `    --card-inset-block: var(--spaces-${block});\n` +
          `    --card-space: var(--spaces-${space});`,
      )
    },
  )

  test("keeps links on solid cards in the card's contrast color", () => {
    expect(css).toMatch(
      /\.ui-card\[data-variant="solid"\] \.ui-link \{\s*color: inherit;\s*\}/,
    )
  })

  test("has no accessibility violations", async () => {
    await a11y(card)
  })
})
