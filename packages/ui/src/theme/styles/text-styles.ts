import type { StyleSheet } from "../../core/types"

export const textStyles: StyleSheet = {
  body: { fontSize: "md", lineHeight: "normal" },
  "body.lg": { fontSize: "lg", lineHeight: "tall" },
  "body.sm": { fontSize: "sm", lineHeight: "normal" },
  caption: { fontSize: "xs", fontWeight: "medium", lineHeight: "short" },
  display: {
    fontFamily: "heading",
    fontSize: "5xl",
    fontWeight: "bold",
    letterSpacing: "tight",
    lineHeight: "shorter",
  },
  h1: {
    fontFamily: "heading",
    fontSize: "3xl",
    fontWeight: "bold",
    lineHeight: "shorter",
  },
  h2: {
    fontFamily: "heading",
    fontSize: "2xl",
    fontWeight: "semibold",
    lineHeight: "short",
  },
  h3: {
    fontFamily: "heading",
    fontSize: "lg",
    fontWeight: "semibold",
    lineHeight: "short",
  },
  label: { fontSize: "sm", fontWeight: "semibold", lineHeight: "shorter" },
}
