import { defineComponentStyle } from "../../core/define"

export const paginationStyle = defineComponentStyle({
  base: {
    "& > ul": {
      alignItems: "center",
      display: "inline-flex",
      flexWrap: "wrap",
      gap: "inherit",
    },
    "& [data-part=ellipsis]": {
      alignItems: "center",
      color: "fg.muted",
      display: "inline-flex",
      height: "var(--pagination-size)",
      justifyContent: "center",
      minWidth: "var(--pagination-size)",
    },
    "& [data-part=item]": {
      alignItems: "center",
      appearance: "none",
      borderColor: "transparent",
      borderRadius: "md",
      borderWidth: "1px",
      color: "fg",
      cursor: "pointer",
      display: "inline-flex",
      fontWeight: "medium",
      height: "var(--pagination-size)",
      justifyContent: "center",
      minWidth: "var(--pagination-size)",
      paddingInline: "2",
      transitionDuration: "fast",
      transitionProperty: "background-color, border-color, color",
      userSelect: "none",
      _hover: { background: "bg.muted" },
      _disabled: { layerStyle: "disabled" },
    },
    "& svg": {
      flexShrink: 0,
      height: "1em",
      width: "1em",
    },
    "--pagination-size": "{sizes.10}",
    alignItems: "center",
    display: "inline-flex",
    gap: "1",
  },
  sizes: {
    xs: { "--pagination-size": "{sizes.8}", fontSize: "xs" },
    sm: { "--pagination-size": "{sizes.9}", fontSize: "sm" },
    md: { "--pagination-size": "{sizes.10}", fontSize: "sm" },
    lg: { "--pagination-size": "{sizes.11}", fontSize: "md" },
  },
  variants: {
    ghost: {
      "& [data-part=item][aria-current=page]": {
        color: "colorScheme.fg",
        fontWeight: "semibold",
      },
    },
    outline: {
      "& [data-part=item][aria-current=page]": {
        borderColor: "colorScheme.outline",
        color: "colorScheme.fg",
      },
    },
    solid: {
      "& [data-part=item][aria-current=page]": {
        background: "colorScheme.solid",
        color: "colorScheme.contrast",
        _hover: { background: "colorScheme.emphasized" },
      },
    },
    subtle: {
      "& [data-part=item][aria-current=page]": {
        background: "colorScheme.subtle",
        color: "colorScheme.fg",
      },
    },
    surface: {
      "& [data-part=item][aria-current=page]": {
        background: "colorScheme.subtle",
        borderColor: "colorScheme.muted",
        color: "colorScheme.fg",
      },
    },
  },
  defaultProps: {
    colorScheme: "primary",
    size: "md",
    variant: "solid",
  },
})

export type PaginationStyle = typeof paginationStyle
