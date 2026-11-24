import { defineComponentStyle } from "../../core/define"

export const linkStyle = defineComponentStyle({
  base: {
    "& > [data-part=external-indicator]": {
      display: "inline",
      marginInlineStart: "1",
    },
    color: "colorScheme.fg",
  },
  variants: {
    none: {
      textDecoration: "none",
      _hover: { color: "colorScheme.emphasized" },
    },
    plain: {
      textDecoration: "none",
      _hover: {
        textDecoration: "underline",
        textUnderlineOffset: "0.15em",
      },
    },
    subtle: {
      color: "fg.muted",
      textDecoration: "none",
      _hover: {
        color: "colorScheme.fg",
        textDecoration: "underline",
        textUnderlineOffset: "0.15em",
      },
    },
    underline: {
      textDecoration: "underline",
      textUnderlineOffset: "0.15em",
      _hover: { textDecorationThickness: "2px" },
    },
  },
  defaultProps: { colorScheme: "primary", variant: "underline" },
})
