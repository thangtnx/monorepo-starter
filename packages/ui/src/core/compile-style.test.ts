import type { CompileContext } from "./compile-style"
import { compileStyle, nestSelector, splitSelector } from "./compile-style"
import { defineTheme } from "./define"
import { createTokenVars } from "./tokens"

const theme = defineTheme({
  colorSchemeRoles: ["solid"],
  colorSchemes: ["primary"],
  layerStyles: {
    solid: { background: "colorScheme.solid", _hover: { opacity: 0.9 } },
  },
  semanticTokens: {
    colors: { fg: { base: ["#000", "#fff"], muted: ["#333", "#ccc"] } },
  },
  textStyles: { label: { fontSize: "sm", fontWeight: "bold" } },
  tokens: {
    colors: { red: { 500: "#f00" } },
    durations: { fast: "100ms", slow: "300ms" },
    easings: { inOut: "ease-in-out" },
    fontSizes: { sm: "0.875rem" },
    fontWeights: { bold: 700 },
    spaces: { 2: "0.5rem", 4: "1rem" },
  },
})

const context: CompileContext = { theme, vars: createTokenVars(theme) }

const compile = (style: Parameters<typeof compileStyle>[1]) =>
  compileStyle(".x", style, context)

describe("compileStyle", () => {
  test("resolves comma-separated bare tokens without changing separators", () => {
    expect(
      compile({ transitionDuration: "fast,slow,\t200ms,  fast" })[0]
        ?.declarations,
    ).toStrictEqual([
      "transition-duration: var(--durations-fast),var(--durations-slow),\t200ms,  var(--durations-fast)",
    ])
  })

  test("uses kebab-case variables for bare and explicit camel-case tokens", () => {
    expect(
      compile({
        animationTimingFunction: "{easings.inOut}",
        transitionTimingFunction: "inOut",
      })[0]?.declarations,
    ).toStrictEqual([
      "animation-timing-function: var(--easings-in-out)",
      "transition-timing-function: var(--easings-in-out)",
    ])
  })

  test("resolves bare token names by property", () => {
    expect(
      compile({ color: "fg.muted", gap: "2", padding: "2 4", width: "2" }),
    ).toStrictEqual([
      {
        atRules: [],
        declarations: [
          "color: var(--colors-fg-muted)",
          "gap: var(--spaces-2)",
          "padding: var(--spaces-2) var(--spaces-4)",
          "width: 2",
        ],
        selector: ".x",
      },
    ])
  })

  test("resolves `base` tokens by their group name", () => {
    expect(compile({ color: "fg" })[0]?.declarations).toStrictEqual([
      "color: var(--colors-fg)",
    ])
  })

  test("resolves references inside any value", () => {
    expect(
      compile({ border: "1px solid {colors.red.500}" })[0]?.declarations,
    ).toStrictEqual(["border: 1px solid var(--colors-red-500)"])
  })

  test("throws on an unknown reference", () => {
    expect(() => compile({ color: "{colors.nope}" })).toThrow(
      'Unknown token "{colors.nope}"',
    )
  })

  test("keeps unknown bare values and custom properties as written", () => {
    expect(
      compile({ "--size": "3rem", color: "currentColor" })[0]?.declarations,
    ).toStrictEqual(["--size: 3rem", "color: currentColor"])
  })

  test("nests conditions and selectors after the parent rule", () => {
    expect(
      compile({
        "& + &": { gap: "2" },
        color: "fg",
        _hover: { color: "fg.muted" },
      }).map((rule) => rule.selector),
    ).toStrictEqual([
      ".x",
      ".x + .x",
      ".x:hover:where(:not(:disabled, [data-disabled], [aria-disabled=true]))",
    ])
  })

  test("expands selector lists in conditions", () => {
    expect(
      compile({ _disabled: { opacity: 0.5 } }).map((rule) => rule.selector),
    ).toStrictEqual([".x:disabled, .x[data-disabled], .x[aria-disabled=true]"])
  })

  test("wraps at-rule conditions", () => {
    expect(compile({ _motionReduce: { opacity: 1 } })).toStrictEqual([
      {
        atRules: ["@media (prefers-reduced-motion: reduce)"],
        declarations: ["opacity: 1"],
        selector: ".x",
      },
    ])
  })

  test("expands layer and text styles, letting own keys win", () => {
    expect(
      compile({
        layerStyle: "solid",
        textStyle: "label",
        fontWeight: 400,
        _hover: { opacity: 1 },
      }),
    ).toStrictEqual([
      {
        atRules: [],
        declarations: [
          "font-size: var(--font-sizes-sm)",
          "font-weight: 400",
          "background: var(--color-scheme-solid)",
        ],
        selector: ".x",
      },
      {
        atRules: [],
        declarations: ["opacity: 1"],
        selector:
          ".x:hover:where(:not(:disabled, [data-disabled], [aria-disabled=true]))",
      },
    ])
  })

  test("throws on unknown styles and conditions", () => {
    expect(() => compile({ layerStyle: "nope" })).toThrow(
      'Unknown layer style "nope"',
    )
    expect(() => compile({ nope: { color: "red" } })).toThrow(
      'Unknown condition "nope"',
    )
  })

  test("reports the path of a circular style reference", () => {
    const circularTheme = {
      ...theme,
      layerStyles: { shared: { textStyle: "shared" } },
      textStyles: { shared: { layerStyle: "shared" } },
    }

    expect(() =>
      compileStyle(
        ".x",
        { layerStyle: "shared" },
        { ...context, theme: circularTheme },
      ),
    ).toThrow(
      'Circular style reference: layer style "shared" -> text style "shared" -> layer style "shared"',
    )
  })

  test("rejects cycles through a nested condition", () => {
    const circularTheme = {
      ...theme,
      layerStyles: { nested: { _hover: { layerStyle: "nested" } } },
    }

    expect(() =>
      compileStyle(
        ".x",
        { layerStyle: "nested" },
        { ...context, theme: circularTheme },
      ),
    ).toThrow(
      'Circular style reference: layer style "nested" -> layer style "nested"',
    )
  })

  test("lets nested overrides replace an unresolved inherited reference", () => {
    const overrideTheme = {
      ...theme,
      layerStyles: { inherited: { _hover: { textStyle: "missing" } } },
    }

    expect(
      compileStyle(
        ".x",
        { layerStyle: "inherited", _hover: { textStyle: "label" } },
        { ...context, theme: overrideTheme },
      )[0]?.declarations,
    ).toStrictEqual([
      "font-size: var(--font-sizes-sm)",
      "font-weight: var(--font-weights-bold)",
    ])
  })
})

describe("splitSelector", () => {
  test("ignores commas inside parentheses", () => {
    expect(splitSelector("a:not(b, c), d")).toStrictEqual(["a:not(b, c)", "d"])
  })

  test("ignores delimiters in attributes, quotes and escaped characters", () => {
    const parts = [
      '&[data-label="a, b"]',
      "&[title='(']",
      String.raw`&[data-label="a\", b"]`,
      String.raw`&[data-label=a\,b]`,
      String.raw`.a\,b`,
      "&:active",
    ]

    expect(splitSelector(parts.join(", "))).toStrictEqual(parts)
  })
})

describe("nestSelector", () => {
  test("combines every parent with every template part", () => {
    expect(nestSelector(".a, .b", "&:hover, & svg")).toBe(
      ".a:hover, .b:hover, .a svg, .b svg",
    )
  })
})
