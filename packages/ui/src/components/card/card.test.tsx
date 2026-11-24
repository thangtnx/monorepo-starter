import { a11y, render, screen } from "#test"
import { createCss } from "../../core"
import { theme } from "../../theme"
import { cardStyle } from "./card.style"
import { Card, CardPropsContext, useCardPropsContext } from "./index"

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
    expect(header).toHaveClass("ui-card__header")
    expect(header?.tagName).toBe("HEADER")
    expect(body).toHaveClass("ui-card__body")
    expect(body?.tagName).toBe("DIV")
    expect(footer).toHaveClass("ui-card__footer")
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
    ["xl", "8", "7", "2xl"],
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

  test.each(["panel", "elevated"])(
    "sets the default foreground color on the %s card",
    (variant) => {
      expect(css).toMatch(
        new RegExp(
          `\\.ui-card\\[data-variant="${variant}"\\] \\{[^}]*\\scolor: var\\(--colors-fg\\);`,
        ),
      )
    },
  )

  test("resolves styles independently for nested cards", () => {
    render(
      <Card.Root
        colorScheme="primary"
        size="xl"
        variant="solid"
        aria-label="Outer"
      >
        <Card.Header>Outer header</Card.Header>
        <Card.Body>
          <Card.Root aria-label="Inner">
            <Card.Header>Inner header</Card.Header>
            <Card.Body>Inner body</Card.Body>
            <Card.Footer>Inner footer</Card.Footer>
          </Card.Root>
        </Card.Body>
        <Card.Footer>Outer footer</Card.Footer>
      </Card.Root>,
    )

    const outer = screen.getByRole("article", { name: "Outer" })
    const inner = screen.getByRole("article", { name: "Inner" })
    for (const slot of [
      outer,
      screen.getByText("Outer header"),
      inner.parentElement,
      screen.getByText("Outer footer"),
    ]) {
      expect(slot).toHaveAttribute("data-size", "xl")
      expect(slot).toHaveAttribute("data-variant", "solid")
      expect(slot).toHaveAttribute("data-scheme", "primary")
    }
    for (const slot of [
      inner,
      screen.getByText("Inner header"),
      screen.getByText("Inner body"),
      screen.getByText("Inner footer"),
    ]) {
      expect(slot).toHaveAttribute("data-size", "md")
      expect(slot).toHaveAttribute("data-variant", "panel")
      expect(slot).toHaveAttribute("data-scheme", "neutral")
    }
  })

  test("reads PropsContext defaults and gives explicit root props precedence", () => {
    function ContextSize() {
      return <Card.Header>{Card.usePropsContext()?.size}</Card.Header>
    }

    expect(Card.PropsContext).toBe(CardPropsContext)
    expect(Card.usePropsContext).toBe(useCardPropsContext)

    render(
      <Card.PropsContext
        value={{ colorScheme: "primary", size: "lg", variant: "outline" }}
      >
        <Card.Root aria-label="With defaults">
          <ContextSize />
        </Card.Root>
        <Card.Root size="sm" aria-label="With override">
          <Card.Body>Additional information</Card.Body>
        </Card.Root>
      </Card.PropsContext>,
    )

    const root = screen.getByRole("article", { name: "With defaults" })
    expect(root).toHaveAttribute("data-variant", "outline")
    expect(root).toHaveAttribute("data-scheme", "primary")
    expect(root).toHaveAttribute("data-size", "lg")
    expect(screen.getByText("lg")).toHaveAttribute("data-size", "lg")
    const override = screen.getByRole("article", { name: "With override" })
    expect(override).toHaveAttribute("data-size", "sm")
    expect(override).toHaveAttribute("data-variant", "outline")
    expect(override).toHaveAttribute("data-scheme", "primary")
    expect(screen.getByText("Additional information")).toHaveAttribute(
      "data-size",
      "sm",
    )
  })

  test("keeps links on solid cards in the card's contrast color", () => {
    expect(css).toMatch(
      /@scope \(\.ui-card\) to \(\.ui-card\) \{\s*:scope:is\(\.ui-card\[data-variant="solid"\]\) :is\(a, \.ui-link\) \{\s*color: inherit;/,
    )
  })

  test("has no accessibility violations", async () => {
    await a11y(card)
  })
})
