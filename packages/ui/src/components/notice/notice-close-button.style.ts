import { defineComponentStyle } from "../../core/define"

export const noticeCloseButtonStyle = defineComponentStyle({
  base: {
    alignItems: "center",
    background: "transparent",
    border: 0,
    borderRadius: "sm",
    color: "inherit",
    cursor: "pointer",
    display: "inline-flex",
    flexShrink: 0,
    height: "8",
    justifyContent: "center",
    marginBlock: "-0.25rem",
    width: "8",
    _hover: { background: "color-mix(in srgb, currentColor 12%, transparent)" },
    _disabled: { layerStyle: "disabled" },
  },
})
