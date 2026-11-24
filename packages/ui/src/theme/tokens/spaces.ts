const spaceSteps = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24]

/** Multiples of 0.25rem: `4` is 1rem. */
export const spaces = Object.fromEntries(
  spaceSteps.map((step) => [step, `${step * 0.25}rem`]),
)
