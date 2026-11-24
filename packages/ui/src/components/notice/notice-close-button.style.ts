import { defineComponentStyle } from "../../core/define"

export const noticeCloseButtonStyle = defineComponentStyle({
  base: {
    alignItems: "center",
    background: "transparent",
    border: 0,
    borderRadius: "sm",
    color: "fg",
    cursor: "pointer",
    display: "inline-flex",
    flexShrink: 0,
    height: "8",
    justifyContent: "center",
    width: "8",
    _hover: { background: "bg.muted" },
    _disabled: { layerStyle: "disabled" },
  },
})
