import { createRef } from "react"
import { a11y, render, screen } from "#test"
import { Text } from "./text"

describe("<Text />", () => {
  test("renders a paragraph by default and supports an inline span", () => {
    const paragraphRef = createRef<HTMLParagraphElement>()
    const spanRef = createRef<HTMLSpanElement>()
    render(
      <Text ref={paragraphRef}>
        Updated{" "}
        <Text ref={spanRef} as="span" variant="caption">
          today
        </Text>
      </Text>,
    )

    const paragraph = screen.getByRole("paragraph")
    expect(paragraphRef.current).toBe(paragraph)
    expect(spanRef.current).toBe(screen.getByText("today"))
    expect(paragraph).toHaveTextContent("Updated today")
    expect(paragraph).toHaveAttribute("data-variant", "body")
    expect(screen.getByText("today").tagName).toBe("SPAN")
    expect(screen.getByText("today")).toHaveAttribute("data-variant", "caption")
  })

  test("has no accessibility violations", async () => {
    await a11y(<Text>Account details</Text>)
  })
})
