import type { CompileContext, CssRule } from "./compile-style"
import type { ComponentStyle, ModeValue, StyleSheet, Theme } from "./types"
import { compileStyle, serializeRule } from "./compile-style"
import {
  colorSchemeVar,
  createTokenVars,
  flattenTokens,
  resolveValue,
  toKebab,
  toVarName,
} from "./tokens"

export const componentClassName = (name: string) => `ui-${name}`

const isModeValue = (value: unknown): value is ModeValue => Array.isArray(value)

/** Compiles one component style into rules keyed on `data-*` attributes. */
export function compileComponentStyle(
  name: string,
  { base, props, sizes, variants }: ComponentStyle,
  context: CompileContext,
): CssRule[] {
  const root = `.${componentClassName(name)}`
  const baseRules = base ? compileStyle(root, base, context) : []
  const isRoot = (rule: CssRule) =>
    rule.selector === root && rule.atRules.length === 0
  const select = (attribute: string, styles: StyleSheet = {}) =>
    Object.entries(styles).flatMap(([value, style]) =>
      compileStyle(`${root}[data-${attribute}="${value}"]`, style, context),
    )

  return [
    ...baseRules.filter(isRoot),
    ...select("variant", variants),
    ...select("size", sizes),
    ...Object.entries(props ?? {}).flatMap(([prop, values]) =>
      select(toKebab(prop), values),
    ),
    ...baseRules.filter((rule) => !isRoot(rule)),
  ]
}

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

const layer = (name: string, rules: CssRule[]) =>
  [
    `@layer ${name} {`,
    ...rules.map((rule) => serializeRule(rule, 1)),
    "}",
  ].join("\n")

/**
 * Builds the complete stylesheet: reset, tokens with light and dark values,
 * color schemes, global styles and every component, in cascade layers so app
 * styles always win.
 */
export function createCss(
  theme: Theme,
  components: { [key: string]: ComponentStyle },
): string {
  const context: CompileContext = { theme, vars: createTokenVars(theme) }
  const sheet = (styles: StyleSheet = {}) =>
    Object.entries(styles).flatMap(([selector, style]) =>
      compileStyle(selector, style, context),
    )

  return `${[
    "@layer reset, tokens, global, components;",
    layer("reset", sheet(theme.resetStyle)),
    layer("tokens", compileTokens(context)),
    layer("global", sheet(theme.globalStyle)),
    layer(
      "components",
      Object.entries(components).flatMap(([name, style]) =>
        compileComponentStyle(name, style, context),
      ),
    ),
  ].join("\n\n")}\n`
}
