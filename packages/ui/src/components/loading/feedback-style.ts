import type { TokenVars } from "../../core/tokens"
import { createTokenVars, resolveValue } from "../../core/tokens"
import { theme } from "../../theme"

let tokenVars: TokenVars | undefined

export function resolveFeedbackToken(property: string, value: string) {
  return resolveValue(property, value, (tokenVars ??= createTokenVars(theme)))
}

export function feedbackValue(
  property: string,
  value: number | string | undefined,
  unit: "px" | "s" = "px",
) {
  if (value === undefined) return
  return typeof value === "number"
    ? `${value}${unit}`
    : resolveFeedbackToken(property, value)
}
