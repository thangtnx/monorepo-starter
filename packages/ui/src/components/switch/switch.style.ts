import { defineComponentStyle } from "../../core/define"

export const switchStyle = defineComponentStyle({
  base: {
    "&:dir(rtl)": { "--slide": "-100%" },
    "& > input + span": {
      alignContent: "center",
      boxShadow: "var(--track-shadow)",
      boxSizing: "content-box",
      gridTemplateRows: "100%",
      justifyItems: "start",
      padding: "var(--track-padding)",
      transition: "background {durations.fast}, box-shadow {durations.fast}",
    },
    "& > input:checked + span": {
      "--track-shadow": "none",
    },
    "& > input:checked + span > span": {
      "--thumb-edge": "transparent",
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
      boxShadow:
        "0 0 0 1px var(--thumb-edge, {colors.border}), var(--thumb-shadow)",
      color: "{colors.black}",
      display: "inline-grid",
      fontSize: "calc(var(--thumb) * .75)",
      height: "var(--thumb)",
      lineHeight: 1,
      minHeight: 0,
      placeItems: "center",
      transition:
        "background {durations.fast}, box-shadow {durations.fast}, translate {durations.fast}",
      width: "var(--thumb)",
    },
    "& [data-part=thumb] > span": {
      alignItems: "center",
      display: "inline-flex",
      justifyContent: "center",
      lineHeight: 1,
    },
    "& [data-part=thumb] svg": {
      flexShrink: 0,
      height: "1em",
      width: "1em",
    },
    "& input:not(:checked) + span [data-icon=on], & input:checked + span [data-icon=off]":
      { display: "none" },
    "--check-bg": "{colors.bg.emphasized}",
    "--check-border": 0,
    "--check-height": "calc(var(--thumb) - var(--track-inset))",
    "--check-width": "calc(var(--thumb) * 2)",
    "--thumb": "{sizes.4}",
    "--thumb-edge": "{colors.border.emphasized}",
    "--thumb-ink": "currentColor",
    "--thumb-on": "{colors.white}",
    "--thumb-radius": "var(--check-radius)",
    "--thumb-shadow": "{shadows.sm}",
    "--track-inset": "0px",
    "--track-padding": 0,
    "--track-shadow": "inset 0 0 0 1px {colors.border.emphasized}",
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
