import { defineComponentStyle } from "../../core/define"

export const loadingLayerStyle = defineComponentStyle({
  base: {
    "& .ui-loading-message": {
      display: "-webkit-box",
      overflow: "hidden",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: 3,
    },
    "&::backdrop": { background: "rgb(0 0 0 / 50%)" },
    "&:not(dialog)": {
      "& .ui-loading-message": { fontSize: "sm", WebkitLineClamp: 1 },
      bottom: "4",
      insetInlineEnd: "{spaces.4}",
      maxWidth: "20rem",
      padding: "2",
    },
    "&[data-enter]": {
      animation: "ui-feedback-fade-in {durations.slower} ease-out",
    },
    "&[data-screen], &[data-screen]::backdrop": {
      background: "bg",
      boxShadow: "none",
    },
    "&[open]": { margin: "auto" },
    background: "bg.panel",
    "body:has(&[data-lock='all'])": { touchAction: "none" },
    "body:has(&[data-lock])": { overflow: "hidden" },
    borderRadius: "md",
    boxShadow: "lg",
    color: "inherit",
    maxWidth: "min(24rem, 90vw)",
    padding: "4",
    position: "fixed",
    zIndex: "toast",
  },
})
