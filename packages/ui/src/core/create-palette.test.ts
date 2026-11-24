import { createPalette, paletteSteps } from "./create-palette"

describe("createPalette", () => {
  test("builds every step as an OKLCH color of the given hue", () => {
    const palette = createPalette(150, 0.2)

    expect(Object.keys(palette)).toStrictEqual(paletteSteps.map(String))
    expect(palette[600]).toBe("oklch(0.51 0.2 150)")
    expect(palette[50]).toBe("oklch(0.98 0.024 150)")
  })

  test("gets darker at every step", () => {
    const lightness = Object.values(createPalette(0, 0.1)).map((color) =>
      Number(color.slice(6).split(" ")[0]),
    )

    expect(lightness).toStrictEqual(lightness.toSorted((a, b) => b - a))
  })
})
