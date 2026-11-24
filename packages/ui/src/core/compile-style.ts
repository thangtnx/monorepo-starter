import type { TokenVars } from "./tokens"
import type {
  ComponentCompound,
  ComponentRecipe,
  CompoundValue,
  StyleObject,
  StyleSheet,
  Theme,
} from "./types"
import { conditions } from "./conditions"
import {
  componentClassName,
  slotClassName,
  styleAttributeName,
} from "./style-attributes"
import { resolveValue, toKebab } from "./tokens"

export interface CssRule {
  atRules: string[]
  declarations: string[]
  selector: string
}

export const recipeLayers = [
  "base",
  "size",
  "variant",
  "props",
  "compounds",
] as const

interface RecipeRule extends CssRule {
  layer: (typeof recipeLayers)[number]
}

export interface CompileContext {
  theme: Theme
  vars: TokenVars
}

function attributeSelector(prop: string, value: CompoundValue) {
  const escaped = Array.from(String(value), (char) => {
    const code = char.charCodeAt(0)
    if (code < 32 || code === 127 || char === '"' || char === "\\")
      return `\\${code.toString(16)} `
    return char
  }).join("")
  return `[${styleAttributeName(prop)}="${escaped}"]`
}

function compoundAttributeSelector(prop: string, value: unknown) {
  if (
    typeof value !== "string" &&
    typeof value !== "number" &&
    typeof value !== "boolean"
  )
    throw new Error(`Invalid compound condition "${prop}"`)

  return attributeSelector(prop, value)
}

function compoundSelector<S>(
  root: string,
  conditions: Omit<ComponentCompound<S>, "css">,
) {
  let selector = root
  for (const [prop, value] of Object.entries(conditions)) {
    if (value === undefined) continue
    if (Array.isArray(value)) {
      if (value.length === 0) return undefined
      const options = Array.from(value, (option) =>
        compoundAttributeSelector(prop, option),
      )
      selector += `:is(${options.join(", ")})`
    } else {
      selector += compoundAttributeSelector(prop, value)
    }
  }
  return selector
}

type RecipeStyles<S> = {
  base?: S
  compounds?: readonly ComponentCompound<S>[]
  props?: { [key: string]: { [key: string]: S } }
  sizes?: { [key: string]: S }
  variants?: { [key: string]: S }
}

function compileRecipe<S>(
  { base, compounds, props, sizes, variants }: RecipeStyles<S>,
  compile: (
    style: S,
    select: (root: string) => string | undefined,
  ) => CssRule[],
  orderBase?: (rule: CssRule) => boolean,
): RecipeRule[] {
  const rules = (
    layer: RecipeRule["layer"],
    style: S,
    select: (root: string) => string | undefined,
  ) => compile(style, select).map((rule) => ({ ...rule, layer }))
  const modifier = (
    layer: RecipeRule["layer"],
    prop: string,
    styles: { [key: string]: S } = {},
  ) =>
    Object.entries(styles).flatMap(([value, style]) =>
      rules(layer, style, (root) => root + attributeSelector(prop, value)),
    )

  const baseRules = base ? rules("base", base, (root) => root) : []
  const sizeRules = modifier("size", "size", sizes)
  const variantRules = modifier("variant", "variant", variants)
  const propRules = Object.entries(props ?? {}).flatMap(([prop, styles]) =>
    modifier("props", prop, styles),
  )
  return [
    ...(orderBase ? baseRules.filter(orderBase) : baseRules),
    ...(orderBase
      ? [...variantRules, ...sizeRules]
      : [...sizeRules, ...variantRules]),
    ...propRules,
    ...(orderBase
      ? layerFlatConditions(
          baseRules.filter((rule) => !orderBase(rule)),
          [sizeRules, variantRules, propRules],
        )
      : []),
    ...(compounds ?? []).flatMap(({ css, ...conditions }) =>
      rules("compounds", css, (root) => compoundSelector(root, conditions)),
    ),
  ]
}

function layerFlatConditions(
  conditions: RecipeRule[],
  modifiers: RecipeRule[][],
) {
  const property = (declaration: string) =>
    declaration.slice(0, declaration.indexOf(":"))
  const layers = new Map<string, RecipeRule["layer"]>()
  for (const rules of modifiers)
    for (const rule of rules)
      for (const declaration of rule.declarations)
        layers.set(property(declaration), rule.layer)

  // Legacy state and media rules used to compete with modifiers by specificity
  // and source order. Keep overlapping declarations in the modifier's layer.
  return conditions.flatMap((rule) => {
    const declarations = Map.groupBy(
      rule.declarations,
      (declaration) => layers.get(property(declaration)) ?? rule.layer,
    )
    return [...declarations].map(([layer, values]) => ({
      ...rule,
      declarations: values,
      layer,
    }))
  })
}

/** Compiles a recipe's styles onto the elements carrying its classes. */
export function compileComponentStyle(
  name: string,
  recipe: ComponentRecipe,
  context: CompileContext,
): RecipeRule[] {
  if ("kind" in recipe)
    return compileRecipe(recipe, (styles, select) =>
      Object.entries(styles).flatMap(([slot, style]) => {
        const selector = select(`.${slotClassName(name, slot)}`)
        return selector && style ? compileStyle(selector, style, context) : []
      }),
    )

  const root = `.${componentClassName(name)}`
  return compileRecipe(
    recipe,
    (style, select) => {
      const selector = select(root)
      return selector ? compileStyle(selector, style, context) : []
    },
    (rule) => rule.selector === root && rule.atRules.length === 0,
  )
}

/** Splits a selector list at top-level, unescaped commas. */
export function splitSelector(selector: string): string[] {
  const parts: string[] = []
  let depth = 0
  let brackets = 0
  let quote: string | undefined
  let start = 0

  for (let index = 0; index < selector.length; index++) {
    const char = selector[index]

    if (char === "\\") {
      index++
    } else if (quote) {
      if (char === quote) quote = undefined
    } else if (char === '"' || char === "'") {
      quote = char
    } else if (char === "[") {
      brackets++
    } else if (char === "]") {
      brackets--
    } else if (brackets > 0) {
      continue
    } else if (char === "(") {
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

function assertAcyclic(
  style: StyleObject,
  theme: Theme,
  checked: WeakSet<StyleObject>,
  path: string[] = [],
) {
  if (checked.has(style)) return

  const { layerStyle, textStyle, ...rest } = style
  const checkReference = (
    styles: StyleSheet | undefined,
    name: unknown,
    kind: string,
  ) => {
    if (typeof name !== "string") return
    const target = styles?.[name]
    if (!target) return

    const reference = `${kind} "${name}"`
    const next = [...path, reference]
    if (path.includes(reference))
      throw new Error(`Circular style reference: ${next.join(" -> ")}`)
    assertAcyclic(target, theme, checked, next)
  }

  checkReference(theme.textStyles, textStyle, "text style")
  checkReference(theme.layerStyles, layerStyle, "layer style")
  for (const value of Object.values(rest))
    if (isStyleObject(value)) assertAcyclic(value, theme, checked, path)

  checked.add(style)
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

  assertAcyclic(style, context.theme, new WeakSet())
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
