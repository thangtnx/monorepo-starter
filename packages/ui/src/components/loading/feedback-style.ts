import { createTokenVars, resolveValue } from "../../core/tokens"
import { theme } from "../../theme"

const tokenVars = createTokenVars(theme)

export function feedbackValue(
  property: string,
  value: number | string | undefined,
  unit: "px" | "s" = "px",
) {
  if (value === undefined) return
  return typeof value === "number"
    ? `${value}${unit}`
    : resolveValue(property, value, tokenVars)
}
