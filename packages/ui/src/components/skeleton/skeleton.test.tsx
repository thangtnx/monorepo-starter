import { a11y, render, screen } from "#test"
import { createCss } from "../../core"
import { theme } from "../../theme"
import { Skeleton, SkeletonCircle, SkeletonText } from "./index"
import { skeletonTextStyle } from "./skeleton-text.style"
import { skeletonStyle } from "./skeleton.style"

describe("skeleton", () => {
  test("hides pending content from assistive technology and exposes it after loading", () => {
    const { rerender } = render(
      <Skeleton>
        <button type="button">Open profile</button>
      </Skeleton>,
    )
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
    rerender(
      <Skeleton loading={false}>
        <button type="button">Open profile</button>
      </Skeleton>,
    )
    expect(
      screen.getByRole("button", { name: "Open profile" }),
    ).toBeInTheDocument()
  })

  test("renders the requested shapes and text lines", () => {
    const { container } = render(
      <>
        <SkeletonCircle />
        <SkeletonText lineClamp={4} />
      </>,
    )
    expect(container.querySelectorAll('[data-shape="circle"]')).toHaveLength(1)
    expect(
      container.querySelectorAll('[data-shape="text"]:not([hidden])'),
    ).toHaveLength(4)
  })

  test("keeps text placeholders full width until the content is ready", () => {
    const { container, rerender } = render(
      <SkeletonText>Profile loaded</SkeletonText>,
    )
    const lines = container.querySelectorAll('[data-shape="text"]')
    expect(lines).toHaveLength(3)
    for (const line of lines)
      expect(line).toHaveAttribute("data-fit-content", "false")
    expect(screen.queryByText("Profile loaded")).not.toBeInTheDocument()

    rerender(<SkeletonText loading={false}>Profile loaded</SkeletonText>)
    expect(screen.getByText("Profile loaded")).toBeVisible()
    expect(container.querySelectorAll('[data-shape="text"]')).toHaveLength(1)
  })

  test("defaults to fitting children and forwards dimensions, paint and fade timing", () => {
    const { rerender } = render(
      <Skeleton
        data-testid="skeleton"
        endColor="#333"
        height="2rem"
        startColor="danger.solid"
        width={150}
      >
        Profile
      </Skeleton>,
    )
    const skeleton = screen.getByTestId("skeleton")
    expect(skeleton).toHaveAttribute("data-fit-content", "true")
    expect(skeleton.style.getPropertyValue("--skeleton-width")).toBe("150px")
    expect(skeleton.style.getPropertyValue("--skeleton-height")).toBe("2rem")
    expect(skeleton.style.getPropertyValue("--skeleton-start")).toBe(
      "var(--colors-danger-solid)",
    )
    expect(skeleton.style.getPropertyValue("--skeleton-end")).toBe("#333")
    const css = createCss(theme, { skeleton: skeletonStyle })
    expect(css).toContain("var(--skeleton-duration, 1.2s)")
    expect(css).toContain("var(--skeleton-start, var(--colors-bg-emphasized))")
    expect(css).toContain("var(--skeleton-width, var(--skeleton-fit, 100%))")
    rerender(
      <Skeleton
        data-testid="skeleton"
        fadeDuration={0.3}
        fitContent={false}
        loading={false}
      >
        Profile
      </Skeleton>,
    )
    expect(skeleton).toHaveAttribute("data-fit-content", "false")
    expect(skeleton.style.getPropertyValue("--skeleton-duration")).toBe("0.3s")
    rerender(<Skeleton data-testid="skeleton" />)
    expect(skeleton).toHaveAttribute("data-fit-content", "false")
  })

  test("sets SkeletonText gap from a space token and retains a CSS fallback", () => {
    render(<SkeletonText gap="4" rootProps={{ "aria-label": "Placeholder" }} />)
    const placeholder = screen.getByLabelText("Placeholder")
    expect(placeholder.style.getPropertyValue("--skeleton-gap")).toBe(
      "var(--spaces-4)",
    )
    const css = createCss(theme, { "skeleton-text": skeletonTextStyle })
    expect(css).toContain("gap: var(--skeleton-gap, var(--spaces-2))")
  })

  test("suppresses pulse, shine and loaded fade when reduced motion is requested", async () => {
    const css = createCss(theme, { skeleton: skeletonStyle })
    expect(css).toMatch(
      /prefers-reduced-motion: reduce[^}]+\.ui-skeleton[^}]+animation-name: none !important/,
    )

    await a11y(
      <>
        <Skeleton />
        <SkeletonCircle />
        <SkeletonText loading={false}>Profile loaded</SkeletonText>
      </>,
    )
  })
})
