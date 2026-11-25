import { defineComponentSlotStyle } from "../../core/define"

export const popoverStyle = defineComponentSlotStyle({
  base: {
    body: {
      fontSize: "sm",
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
      height: "7",
      insetBlockStart: "3",
      insetInlineEnd: "3",
      justifyContent: "center",
      padding: 0,
      position: "absolute",
      transition: "background-color {durations.fast}, color {durations.fast}",
      width: "7",
      _hover: { background: "bg.muted", color: "fg" },
      _disabled: { layerStyle: "disabled" },
    },
    footer: {
      alignItems: "center",
      display: "flex",
      gap: "2",
      justifyContent: "flex-end",
      paddingBlockStart: "3",
    },
    header: {
      fontSize: "sm",
      fontWeight: "semibold",
      paddingBlockEnd: "2",
      paddingInlineEnd: "8",
    },
    root: {
      "&:popover-open, &[data-open=true]": {
        "@starting-style": { opacity: 0, transform: "scale(0.96)" },
        opacity: 1,
        transform: "scale(1)",
      },
      "--floating-x": "0px",
      "--floating-y": "0px",
      "--popover-width": "{sizes.xs}",
      background: "bg.panel",
      borderColor: "border",
      borderRadius: "md",
      borderWidth: "1px",
      boxShadow: "0 2px 4px rgb(0 0 0 / 0.1), 0 0 1px rgb(0 0 0 / 0.28)",
      color: "fg",
      inlineSize: "var(--popover-width)",
      left: "var(--floating-x)",
      margin: 0,
      maxInlineSize: "calc(100dvw - 1rem)",
      opacity: 0,
      overflow: "visible",
      padding: "4",
      position: "fixed",
      top: "var(--floating-y)",
      transform: "scale(0.96)",
      transition:
        "opacity {durations.fast} {easings.out}, transform {durations.fast} {easings.out}, display {durations.fast} allow-discrete, overlay {durations.fast} allow-discrete",
      _motionReduce: { transitionDuration: "1ms" },
    },
  },
  sizes: {
    sm: { root: { "--popover-width": "16rem" } },
    md: { root: { "--popover-width": "{sizes.xs}" } },
    lg: { root: { "--popover-width": "{sizes.sm}" } },
  },
  defaultProps: {
    root: { size: "md" },
  },
})

export type PopoverStyle = typeof popoverStyle
