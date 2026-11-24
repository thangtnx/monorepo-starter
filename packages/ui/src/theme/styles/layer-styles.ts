import type { StyleSheet } from "../../core/types"

export const layerStyles: StyleSheet = {
  disabled: {
    boxShadow: "none",
    cursor: "not-allowed",
    opacity: 0.5,
  },
  ghost: {
    background: "transparent",
    color: "colorScheme.fg",
    _hover: { background: "colorScheme.subtle" },
  },
  outline: {
    background: "transparent",
    borderColor: "colorScheme.outline",
    color: "colorScheme.fg",
    _hover: { background: "colorScheme.subtle" },
  },
  solid: {
    background: "colorScheme.solid",
    color: "colorScheme.contrast",
    _hover: { background: "colorScheme.emphasized" },
  },
  subtle: {
    background: "colorScheme.subtle",
    color: "colorScheme.fg",
    _hover: { background: "colorScheme.muted" },
  },
  surface: {
    background: "colorScheme.subtle",
    borderColor: "colorScheme.muted",
    color: "colorScheme.fg",
    _hover: { background: "colorScheme.muted" },
  },
}
