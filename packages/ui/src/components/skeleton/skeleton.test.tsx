import { a11y, render, screen } from "#test"
import { createCss } from "../../core"
import { theme } from "../../theme"
import { Skeleton, SkeletonCircle, SkeletonText } from "./index"
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
        startColor="tomato"
        width={150}
      >
        Profile
      </Skeleton>,
    )
    const skeleton = screen.getByTestId("skeleton")
    expect(skeleton).toHaveAttribute("data-fit-content", "true")
    expect(skeleton).toHaveAttribute("data-width", "150px")
    expect(skeleton).toHaveAttribute("data-height", "2rem")
    expect(skeleton).toHaveAttribute("data-start-color", "tomato")
    expect(skeleton).toHaveAttribute("data-end-color", "#333")
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
    expect(skeleton).toHaveAttribute("data-duration", "0.3s")
    rerender(<Skeleton data-testid="skeleton" />)
    expect(skeleton).toHaveAttribute("data-fit-content", "false")
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
