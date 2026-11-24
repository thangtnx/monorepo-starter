import { defineComponentStyle } from "../../core/define"

export const skeletonStyle = defineComponentStyle({
  base: {
    "&[data-fit-content='true'][data-loading='true']": {
      "--skeleton-fit": "fit-content",
      display: "inline-block",
    },
    "&[data-loading='false']": {
      animation: "ui-feedback-fade-in var(--skeleton-duration, 100ms)",
    },
    "&[data-loading='true']": {
      "& > .ui-skeleton-content": { visibility: "hidden" },
      animation: "var(--skeleton-animation, none)",
      backgroundColor: "var(--skeleton-end, {colors.bg.muted})",
      borderRadius: "sm",
      inlineSize: "var(--skeleton-width, var(--skeleton-fit, 100%))",
      minBlockSize:
        "var(--skeleton-height, var(--skeleton-default-height, {sizes.6}))",
    },
    "&[data-shape='circle'][data-loading='true']": {
      aspectRatio: "1",
      borderRadius: "full",
      inlineSize: "var(--skeleton-height, {sizes.6})",
    },
    "&[data-shape='text']": { "--skeleton-default-height": "{sizes.4}" },
    "--skeleton-duration": "initial",
    "--skeleton-end": "{colors.bg.muted}",
    "--skeleton-height": "initial",
    "--skeleton-start": "{colors.bg.emphasized}",
    "--skeleton-width": "initial",
    _motionReduce: { animationName: "none !important" },
  },
  variants: {
    none: {},
    pulse: {
      "--skeleton-animation":
        "ui-skeleton-pulse var(--skeleton-duration, 1.2s) ease-in-out infinite alternate",
    },
    shine: {
      "&[data-loading='true']": {
        "--skeleton-animation":
          "ui-skeleton-shine var(--skeleton-duration, 5s) linear infinite",
        backgroundImage:
          "linear-gradient(100deg, var(--skeleton-start) 25%, var(--skeleton-end) 50%, var(--skeleton-start) 75%)",
        backgroundPosition: "-100% 0",
        backgroundSize: "200% 100%",
      },
    },
  },
  defaultProps: { variant: "pulse" },
})
