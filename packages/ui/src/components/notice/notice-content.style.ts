import { defineComponentStyle } from "../../core/define"

export const noticeContentStyle = defineComponentStyle({
  base: {
    "& > .ui-alert-description": {
      display: "-webkit-box",
      overflow: "hidden",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: 2,
    },
    display: "grid",
    flex: "1",
    gap: "1",
    minInlineSize: 0,
    overflowWrap: "anywhere",
  },
})
