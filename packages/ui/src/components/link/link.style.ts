import { defineComponentStyle } from "../../core/define"

export const linkStyle = defineComponentStyle({
  base: {
    "& > [data-part=external-indicator]": {
      display: "inline",
      marginInlineStart: "1",
    },
    color: "colorScheme.fg",
    textDecoration: "underline",
    textUnderlineOffset: "0.15em",
    _hover: { textDecorationThickness: "2px" },
  },
  defaultProps: { colorScheme: "primary" },
})
