import { defineComponentStyle } from "./define"
import { splitStyleProps } from "./split-style-props"

const style = defineComponentStyle({
  props: { fullWidth: { true: {} } },
  sizes: { sm: {}, md: {} },
  variants: { outline: {}, solid: {} },
  defaultProps: { colorScheme: "primary", size: "md", variant: "solid" },
})

describe("splitStyleProps", () => {
  test("applies the style's defaults", () => {
    expect(splitStyleProps("thing", style, {})).toStrictEqual([
      {
        className: "ui-thing",
        "data-scheme": "primary",
        "data-size": "md",
        "data-variant": "solid",
      },
      {},
    ])
  })

  test("maps given props to attributes and keeps the rest", () => {
    expect(
      splitStyleProps("thing", style, {
        className: "extra",
        colorScheme: "danger",
        size: "sm",
        variant: "outline",
        fullWidth: true,
        title: "Hi",
      }),
    ).toStrictEqual([
      {
        className: "ui-thing extra",
        "data-full-width": "true",
        "data-scheme": "danger",
        "data-size": "sm",
        "data-variant": "outline",
      },
      { title: "Hi" },
    ])
  })
})
