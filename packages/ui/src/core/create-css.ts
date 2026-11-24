import type { CompileContext, CssRule } from "./compile-style"
import type { ComponentRecipe, ModeValue, StyleSheet, Theme } from "./types"
import {
  compileComponentStyle,
  compileStyle,
  recipeLayers,
  serializeRule,
} from "./compile-style"
import {
  colorSchemeVar,
  createTokenVars,
  flattenTokens,
  resolveValue,
  toVarName,
} from "./tokens"

export { compileComponentStyle } from "./compile-style"
export { componentClassName } from "./style-attributes"

const isModeValue = (value: unknown): value is ModeValue => Array.isArray(value)

function compileTokens({ theme, vars }: CompileContext): CssRule[] {
  const declare = (name: string, value: number | string) =>
    `${name}: ${resolveValue("", value, vars)}`
  const light: string[] = ["color-scheme: light"]
  const dark: string[] = ["color-scheme: dark"]
  const constant: string[] = []

  const groups = [
    ...Object.entries(theme.tokens),
    ...Object.entries(theme.semanticTokens ?? {}),
  ]

  for (const [category, group] of groups)
    for (const { name, value } of flattenTokens(category, group))
      if (isModeValue(value)) {
        light.push(declare(name, value[0]))
        dark.push(declare(name, value[1]))
      } else {
        constant.push(declare(name, value))
      }

  const rule = (
    selector: string,
    declarations: string[],
    atRules: string[] = [],
  ): CssRule => ({ atRules, declarations, selector })

  return [
    rule(":root", [...constant, ...light]),
    rule('[data-mode="light"]', light),
    rule('[data-mode="dark"]', dark),
    rule(':root:not([data-mode="light"])', dark, [
      "@media (prefers-color-scheme: dark)",
    ]),
    ...theme.colorSchemes.map((scheme) =>
      rule(
        `[data-scheme="${scheme}"]`,
        theme.colorSchemeRoles.map(
          (role) =>
            `${colorSchemeVar(role)}: var(${toVarName("colors", [scheme, role])})`,
        ),
      ),
    ),
  ]
}

const layer = (name: string, rules: CssRule[], depth = 1) =>
  [
    `@layer ${name} {`,
    ...rules.map((rule) => serializeRule(rule, depth)),
    "}",
  ].join("\n")

/**
 * Builds the complete stylesheet: reset, tokens with light and dark values,
 * color schemes, global styles and every component, in cascade layers so app
 * styles always win.
 */
export function createCss(
  theme: Theme,
  components: { [key: string]: ComponentRecipe },
): string {
  const context: CompileContext = { theme, vars: createTokenVars(theme) }
  const sheet = (styles: StyleSheet = {}) =>
    Object.entries(styles).flatMap(([selector, style]) =>
      compileStyle(selector, style, context),
    )
  const rules = Object.entries(components).flatMap(([name, style]) =>
    compileComponentStyle(name, style, context),
  )

  return `${[
    `@layer reset, tokens, global, ${recipeLayers.join(", ")};`,
    layer("reset", sheet(theme.resetStyle)),
    layer("tokens", compileTokens(context), 0),
    layer("global", sheet(theme.globalStyle)),
    ...recipeLayers.map((name) =>
      layer(
        name,
        rules.filter((rule) => rule.layer === name),
      ),
    ),
  ].join("\n")}\n`
}
