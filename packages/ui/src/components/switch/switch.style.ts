import { defineComponentStyle } from "../../core/define"

export const switchStyle = defineComponentStyle({
  base: {
    "&:dir(rtl)": { "--slide": "-100%" },
    "& > input + span": {
      boxSizing: "content-box",
      justifyItems: "start",
      padding: "var(--track-padding)",
      transition: "background {durations.fast}",
    },
    "& > input:checked + span > span": {
      background: "var(--thumb-on)",
      color: "var(--thumb-ink)",
      translate: "var(--slide, 100%)",
    },
    "& > input[aria-invalid=true] + span": {
      boxShadow: "inset 0 0 0 1px var(--check-error)",
    },
    "& [data-part=thumb]": {
      aspectRatio: 1,
      background: "{colors.white}",
      borderRadius: "var(--thumb-radius)",
      boxShadow: "var(--thumb-shadow)",
      color: "{colors.black}",
      display: "inline-grid",
      fontSize: "calc(var(--thumb) * .75)",
      placeItems: "center",
      transition: "background {durations.fast}, translate {durations.fast}",
      width: "var(--thumb)",
    },
    "& input:not(:checked) + span [data-icon=on], & input:checked + span [data-icon=off]":
      { display: "none" },
    "--check-bg": "{colors.bg.muted}",
    "--check-border": 0,
    "--check-height": "calc(var(--thumb) - var(--track-inset))",
    "--check-width": "calc(var(--thumb) * 2)",
    "--thumb": "{sizes.4}",
    "--thumb-ink": "currentColor",
    "--thumb-on": "{colors.white}",
    "--thumb-radius": "var(--check-radius)",
    "--thumb-shadow": "none",
    "--track-inset": "0px",
    "--track-padding": 0,
    "@media (prefers-reduced-motion: reduce)": {
      "& > input + span, & [data-part=thumb]": { transition: "none" },
    },
  },
  props: {
    reverse: { false: {}, true: { flexDirection: "row-reverse" } },
    shape: {
      circle: {},
      rounded: {},
      square: {},
    },
  },
  sizes: {
    sm: {},
    md: {},
    lg: {},
  },
  variants: {
    thin: {},
    thick: {},
  },
  defaultProps: {
    size: "md",
    variant: "thick",
    reverse: false,
    shape: "circle",
  },
})
