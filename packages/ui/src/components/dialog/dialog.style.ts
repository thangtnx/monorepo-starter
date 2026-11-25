import { defineComponentSlotStyle } from "../../core/define"

export const dialogStyle = defineComponentSlotStyle({
  base: {
    body: {
      flex: 1,
      minHeight: 0,
      overflowY: "auto",
      padding: "4 6",
    },
    close: {
      alignItems: "center",
      appearance: "none",
      background: "transparent",
      border: 0,
      borderRadius: "md",
      color: "fg.muted",
      cursor: "pointer",
      display: "inline-flex",
      height: "8",
      insetBlockStart: "4",
      insetInlineEnd: "4",
      justifyContent: "center",
      padding: 0,
      position: "absolute",
      transition: "background-color {durations.fast}, color {durations.fast}",
      width: "8",
      _hover: { background: "bg.muted", color: "fg" },
      _disabled: { layerStyle: "disabled" },
    },
    container: {
      display: "flex",
      flexDirection: "column",
      maxBlockSize: "inherit",
      position: "relative",
    },
    description: {
      color: "fg.muted",
      fontSize: "sm",
      margin: 0,
    },
    footer: {
      alignItems: "center",
      display: "flex",
      gap: "3",
      justifyContent: "flex-end",
      padding: "0 6 6",
    },
    header: {
      display: "flex",
      flexDirection: "column",
      gap: "1",
      padding: "6 12 0 6",
    },
    root: {
      "&::backdrop": {
        background: "rgb(0 0 0 / 0.4)",
        opacity: 0,
        transition:
          "opacity {durations.moderate} {easings.out}, display {durations.moderate} allow-discrete, overlay {durations.moderate} allow-discrete",
      },
      "&[open]": {
        "@starting-style": { opacity: 0, transform: "scale(0.96)" },
        opacity: 1,
        transform: "scale(1)",
      },
      "&[open]::backdrop": {
        "@starting-style": { opacity: 0 },
        opacity: 1,
      },
      "--dialog-width": "{sizes.md}",
      background: "bg.panel",
      borderColor: "border",
      borderRadius: "xl",
      borderWidth: "1px",
      boxShadow: "0 8px 16px rgb(0 0 0 / 0.12), 0 0 1px rgb(0 0 0 / 0.25)",
      color: "fg",
      inlineSize: "var(--dialog-width)",
      margin: "auto",
      maxBlockSize: "calc(100dvh - 2rem)",
      maxInlineSize: "calc(100dvw - 2rem)",
      opacity: 0,
      overflow: "hidden",
      padding: 0,
      transform: "scale(0.96)",
      transition:
        "opacity {durations.moderate} {easings.out}, transform {durations.moderate} {easings.out}, display {durations.moderate} allow-discrete, overlay {durations.moderate} allow-discrete",
      _motionReduce: {
        "&, &::backdrop": { transitionDuration: "1ms" },
      },
    },
    title: {
      fontSize: "lg",
      fontWeight: "semibold",
      lineHeight: "tight",
      margin: 0,
    },
  },
  props: {
    /**
     * Vertical alignment of the dialog within the viewport.
     *
     * @default "center"
     */
    placement: {
      center: {
        root: { margin: "auto" },
      },
      top: {
        root: {
          marginBlockEnd: "auto",
          marginBlockStart: "12",
          marginInline: "auto",
        },
      },
    },
  },
  sizes: {
    sm: { root: { "--dialog-width": "{sizes.sm}" } },
    md: { root: { "--dialog-width": "{sizes.md}" } },
    lg: { root: { "--dialog-width": "{sizes.lg}" } },
    xl: { root: { "--dialog-width": "{sizes.xl}" } },
    full: {
      root: {
        "--dialog-width": "100dvw",
        blockSize: "100dvh",
        borderRadius: "none",
        margin: 0,
        maxBlockSize: "100dvh",
        maxInlineSize: "100dvw",
      },
    },
  },
  defaultProps: {
    root: {
      size: "md",
      placement: "center",
    },
  },
})

export type DialogStyle = typeof dialogStyle
