import type { TokenVars } from "./tokens"
import type { StyleObject, StyleSheet, Theme } from "./types"
import { conditions } from "./conditions"
import { resolveValue, toKebab } from "./tokens"

export interface CssRule {
  atRules: string[]
  declarations: string[]
  selector: string
}

export interface CompileContext {
  theme: Theme
  vars: TokenVars
}

/** Splits a selector list on commas that are not inside parentheses. */
export function splitSelector(selector: string): string[] {
  const parts: string[] = []
  let depth = 0
  let start = 0

  for (let index = 0; index < selector.length; index++) {
    const char = selector[index]

    if (char === "(") {
      depth++
    } else if (char === ")") {
      depth--
    } else if (char === "," && depth === 0) {
      parts.push(selector.slice(start, index).trim())
      start = index + 1
    }
  }

  parts.push(selector.slice(start).trim())

  return parts
}

export const nestSelector = (parent: string, template: string) =>
  splitSelector(template)
    .flatMap((part) =>
      splitSelector(parent).map((value) => part.replaceAll("&", value)),
    )
    .join(", ")

const toCssProperty = (property: string) =>
  property.startsWith("--")
    ? property
    : toKebab(property).replace(/^(webkit|moz|ms)-/, "-$1-")

const isStyleObject = (value: unknown): value is StyleObject =>
  typeof value === "object" && value !== null

function deepMerge(target: StyleObject, source: StyleObject): StyleObject {
  const result: StyleObject = { ...target }

  for (const [key, value] of Object.entries(source)) {
    const current = result[key]

    result[key] =
      isStyleObject(current) && isStyleObject(value)
        ? deepMerge(current, value)
        : value
  }

  return result
}

function lookup(
  styles: StyleSheet | undefined,
  name: unknown,
  kind: string,
): StyleObject {
  if (name === undefined) return {}
  if (typeof name !== "string") throw new Error(`A ${kind} name is a string`)

  const style = styles?.[name]

  if (!style) throw new Error(`Unknown ${kind} "${name}"`)

  return style
}

/** Expands `textStyle` and `layerStyle`; the object's own keys win. */
function expand(style: StyleObject, context: CompileContext): StyleObject {
  const { layerStyle, textStyle, ...rest } = style

  if (layerStyle === undefined && textStyle === undefined) return style

  const { layerStyles, textStyles } = context.theme
  const inherited = deepMerge(
    expand(lookup(textStyles, textStyle, "text style"), context),
    expand(lookup(layerStyles, layerStyle, "layer style"), context),
  )

  return deepMerge(inherited, rest)
}

function walk(
  selector: string,
  atRules: string[],
  style: StyleObject,
  context: CompileContext,
  rules: CssRule[],
) {
  const declarations: string[] = []
  const nested: [string, string[], StyleObject][] = []

  for (const [key, value] of Object.entries(expand(style, context))) {
    if (value === undefined) continue

    if (!isStyleObject(value)) {
      declarations.push(
        `${toCssProperty(key)}: ${resolveValue(key, value, context.vars)}`,
      )
      continue
    }

    const condition = conditions[key] ?? key

    if (condition.startsWith("@"))
      nested.push([selector, [...atRules, condition], value])
    else if (condition.includes("&"))
      nested.push([nestSelector(selector, condition), atRules, value])
    else throw new Error(`Unknown condition "${key}"`)
  }

  if (declarations.length) rules.push({ atRules, declarations, selector })

  for (const [childSelector, childAtRules, childStyle] of nested)
    walk(childSelector, childAtRules, childStyle, context, rules)
}

/** Compiles a style object into CSS rules for the given selector. */
export function compileStyle(
  selector: string,
  style: StyleObject,
  context: CompileContext,
): CssRule[] {
  const rules: CssRule[] = []

  walk(selector, [], style, context, rules)

  return rules
}

const indent = (depth: number) => "  ".repeat(depth)

export function serializeRule(
  { atRules, declarations, selector }: CssRule,
  depth = 0,
): string {
  const inner = depth + atRules.length

  return [
    ...atRules.map((atRule, index) => `${indent(depth + index)}${atRule} {`),
    `${indent(inner)}${selector} {`,
    ...declarations.map((declaration) => `${indent(inner + 1)}${declaration};`),
    `${indent(inner)}}`,
    ...atRules.map(
      (_, index) => `${indent(depth + atRules.length - 1 - index)}}`,
    ),
  ].join("\n")
}
