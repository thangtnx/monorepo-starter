import { defineComponentStyle } from "../../core/define"

export const noticeItemStyle = defineComponentStyle({
  base: {
    "&.ui-alert": { flexWrap: "nowrap" },
    boxShadow: "md",
  },
})
