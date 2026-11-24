export const checkableIndicatorVariants = {
  outline: {},
  solid: {},
  subtle: {},
  surface: {},
}

type CheckableAppearance = {
  [variable: `--${string}`]: number | string | undefined
}

const scheme = (role: string) =>
  `var(--color-scheme-${role}, var(--colors-primary-${role}))`

const solid = scheme("solid")
const contrast = scheme("contrast")
const subtle = scheme("subtle")
const ink = scheme("fg")
const outline = scheme("outline")
const muted = scheme("muted")

const indicatorPaint = {
  base: { "--check-mark": solid },
  outline: { "--check-mark": outline, "--check-on-edge": outline },
  solid: {
    "--check-mark": contrast,
    "--check-on": solid,
    "--check-on-edge": solid,
  },
  subtle: {
    "--check-bg": subtle,
    "--check-edge": "transparent",
    "--check-mark": ink,
  },
  surface: { "--check-bg": subtle, "--check-edge": muted, "--check-mark": ink },
} satisfies { [key: string]: CheckableAppearance }

const indicatorSize = {
  sm: "calc((var(--sizes-3) + var(--sizes-4)) / 2)",
  md: "var(--sizes-4)",
  lg: "var(--sizes-5)",
}

const checkboxGeometry = {
  sm: { "--check-icon-size": "0.625rem" },
  md: { "--check-icon-size": "var(--font-sizes-xs)" },
  lg: { "--check-icon-size": "var(--font-sizes-sm)" },
}

const radioGeometry = {
  sm: { "--radio-dot-size": "calc((var(--sizes-1) + var(--sizes-2)) / 2)" },
  md: { "--radio-dot-size": "var(--sizes-2)" },
  lg: { "--radio-dot-size": "var(--sizes-3)" },
}

const switchGeometry = {
  sm: { "--thumb": "var(--sizes-3)" },
  md: { "--thumb": "var(--sizes-4)" },
  lg: { "--thumb": "var(--sizes-5)" },
}

const switchPaint = {
  thin: {
    "--check-offset": "4px",
    "--check-on": muted,
    "--thumb-ink": contrast,
    "--thumb-on": solid,
    "--thumb-shadow": "var(--shadows-lg)",
    "--track-inset": "var(--sizes-1)",
  },
  thick: {
    "--check-on": solid,
    "--thumb-ink": solid,
    "--thumb-on": contrast,
    "--track-padding": "var(--spaces-1)",
  },
}

const shapeAppearance = {
  checkbox: {
    rounded: { "--check-radius": "var(--radii-sm)" },
    square: {},
  },
  radio: {
    circle: {
      "--check-radius": "var(--radii-full)",
      "--radio-dot-radius": "var(--radii-full)",
    },
    rounded: {
      "--check-radius": "var(--radii-sm)",
      "--radio-dot-radius": "calc(var(--radii-sm) / 2)",
    },
    square: {},
  },
  switch: {
    circle: { "--check-radius": "var(--radii-full)" },
    rounded: {
      "--check-radius": "var(--radii-md)",
      "--thumb-radius": "var(--radii-sm)",
    },
    square: {},
  },
}

export function checkableAppearance(
  type: keyof typeof shapeAppearance,
  size = "md",
  shape = "",
  variant = "",
): CheckableAppearance {
  const shapes: Readonly<{ [key: string]: CheckableAppearance }> =
    shapeAppearance[type]
  const scale = size === "sm" || size === "lg" ? size : "md"
  if (type === "switch")
    return {
      ...switchGeometry[scale],
      ...shapes[shape],
      ...switchPaint[variant === "thin" ? "thin" : "thick"],
    }

  const paints: Readonly<{ [key: string]: CheckableAppearance }> =
    indicatorPaint
  return {
    "--check-size": indicatorSize[scale],
    ...(type === "radio" ? radioGeometry[scale] : checkboxGeometry[scale]),
    ...shapes[shape],
    ...paints[variant],
  }
}
