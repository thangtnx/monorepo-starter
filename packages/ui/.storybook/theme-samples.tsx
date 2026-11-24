import type { ReactNode } from "react"
import type { SemanticTokenGroup, TokenGroup } from "../src/core/types"
import { compileStyle, serializeRule } from "../src/core/compile-style"
import { createTokenVars, flattenTokens } from "../src/core/tokens"
import { theme } from "../src/theme"

interface TokenTableProps {
  category: string
  tokens: SemanticTokenGroup | TokenGroup
  preview: (value: string) => ReactNode
}

export function TokenTable({ category, preview, tokens }: TokenTableProps) {
  const entries = flattenTokens(category, tokens)

  return (
    <table style={{ borderSpacing: "var(--spaces-3)" }}>
      <caption>Token values and previews</caption>
      <thead>
        <tr>
          <th scope="col">CSS variable</th>
          <th scope="col">Value</th>
          <th scope="col">Preview</th>
        </tr>
      </thead>
      <tbody>
        {entries.map(({ name, value }) => (
          <tr key={name}>
            <th scope="row">
              <code>{name}</code>
            </th>
            <td>
              <code>
                {Array.isArray(value)
                  ? `Light: ${value[0]} / Dark: ${value[1]}`
                  : value}
              </code>
            </td>
            <td>{preview(`var(${name})`)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

interface SwatchProps {
  color: string
  radius?: string
  shadow?: string
}

export function Swatch({ color, radius, shadow }: SwatchProps) {
  return (
    <span
      style={{
        backgroundColor: color,
        border: "1px solid var(--colors-border)",
        borderRadius: radius,
        boxShadow: shadow,
        display: "block",
        height: "var(--sizes-8)",
        width: "var(--sizes-16)",
      }}
      aria-hidden="true"
    />
  )
}

export function TokenBar({ width }: { width: string }) {
  return (
    <div
      style={{ maxWidth: "var(--sizes-xs)", overflowX: "auto", width: "100%" }}
    >
      <div
        style={{
          background: "var(--colors-primary-solid)",
          height: "var(--sizes-3)",
          width,
        }}
      />
    </div>
  )
}

interface MotionSampleProps {
  duration?: string
  easing?: string
}

export function MotionSample({
  duration = "var(--durations-moderate)",
  easing = "var(--easings-standard)",
}: MotionSampleProps) {
  return (
    <button type="button" className="theme-motion-sample">
      Animate
      <span
        style={{
          background: "var(--colors-primary-solid)",
          display: "block",
          height: "var(--sizes-3)",
          transitionDuration: duration,
          transitionProperty: "transform",
          transitionTimingFunction: easing,
          width: "var(--sizes-3)",
        }}
        aria-hidden="true"
      />
    </button>
  )
}

export function StackSample({ zIndex }: { zIndex: string }) {
  return (
    <div
      style={{
        height: "var(--sizes-8)",
        isolation: "isolate",
        position: "relative",
        width: "var(--sizes-16)",
      }}
      aria-hidden="true"
    >
      <span
        style={{
          background: "var(--colors-primary-solid)",
          inset: "0 var(--spaces-4) var(--spaces-2) 0",
          position: "absolute",
          zIndex,
        }}
      />
      <span
        style={{
          background: "var(--colors-bg-emphasized)",
          border: "1px solid var(--colors-border)",
          inset: "var(--spaces-2) 0 0 var(--spaces-4)",
          position: "absolute",
        }}
      />
    </div>
  )
}

interface StyleSamplesProps {
  names: string[]
  property: "layerStyle" | "textStyle"
}

export function StyleSamples({ names, property }: StyleSamplesProps) {
  const context = { theme, vars: createTokenVars(theme) }
  const css = names
    .flatMap((name) =>
      compileStyle(
        `[data-theme-style="${name}"]`,
        { [property]: name },
        context,
      ).map((rule) => serializeRule(rule)),
    )
    .join("\n")

  return (
    <>
      <style>{css}</style>
      <dl
        style={{ display: "grid", gap: "var(--spaces-2)" }}
        data-scheme="primary"
      >
        {names.map((name) => {
          const sampleProps = {
            style: {
              borderColor: name === "outline" ? undefined : "transparent",
              borderRadius: "var(--radii-md)",
              borderWidth: "1px",
              padding: "var(--spaces-2)",
            },
            "data-theme-style": name,
          }

          return (
            <div key={name}>
              <dt>
                <code>{name}</code>
              </dt>
              {property === "layerStyle" && name === "disabled" ? (
                <dd>
                  <button type="button" disabled {...sampleProps}>
                    Sample text
                  </button>
                </dd>
              ) : (
                <dd {...sampleProps}>Sample text</dd>
              )}
            </div>
          )
        })}
      </dl>
    </>
  )
}
