import { defineComponentStyle } from "../../core/define"

export const selectRootStyle = defineComponentStyle({
  base: {
    "& > .ui-select": { gridArea: "1 / 1" },
    "&[data-clearable] > .ui-select": { gap: "9" },
    "& [data-part=clear]": {
      "& svg": { blockSize: "4", inlineSize: "4" },
      alignSelf: "center",
      blockSize: "6",
      borderRadius: "sm",
      color: "fg.muted",
      cursor: "pointer",
      display: "grid",
      gridArea: "1 / 1",
      inlineSize: "6",
      justifySelf: "end",
      marginInlineEnd: "8",
      placeItems: "center",
      _hover: { background: "bg.emphasized", color: "fg" },
    },
    "& [data-part=message]": {
      textStyle: "body.sm",
      color: "danger.fg",
      gridArea: "2 / 1",
      marginBlockStart: "1",
    },
    "& [data-part=validation]": {
      height: "1px",
      opacity: 0,
      pointerEvents: "none",
      position: "absolute",
      width: "1px",
    },
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr)",
    position: "relative",
    width: "full",
  },
})
