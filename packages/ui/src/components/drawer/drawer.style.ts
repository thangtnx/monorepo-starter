import { defineComponentSlotStyle } from "../../core/define"

export const drawerStyle = defineComponentSlotStyle({
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
      blockSize: "100%",
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
        "@starting-style": { opacity: 0, transform: "var(--drawer-offset)" },
        opacity: 1,
        transform: "translate(0)",
      },
      "&[open]::backdrop": {
        "@starting-style": { opacity: 0 },
        opacity: 1,
      },
      "--drawer-offset": "translateX(100%)",
      "--drawer-size": "{sizes.md}",
      background: "bg.panel",
      borderColor: "border",
      borderWidth: "1px",
      boxShadow: "0 8px 16px rgb(0 0 0 / 0.12), 0 0 1px rgb(0 0 0 / 0.25)",
      color: "fg",
      margin: 0,
      maxBlockSize: "100dvh",
      maxInlineSize: "100dvw",
      opacity: 0,
      overflow: "hidden",
      padding: 0,
      position: "fixed",
      transform: "var(--drawer-offset)",
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
     * Edge of the viewport from which the drawer slides in.
     *
     * @default "end"
     */
    placement: {
      bottom: {
        root: {
          "--drawer-offset": "translateY(100%)",
          blockSize: "var(--drawer-size)",
          borderStartEndRadius: "xl",
          borderStartStartRadius: "xl",
          inlineSize: "100dvw",
          insetBlockEnd: 0,
          insetBlockStart: "auto",
          insetInline: 0,
          maxBlockSize: "85dvh",
        },
      },
      end: {
        root: {
          "--drawer-offset": "translateX(100%)",
          blockSize: "100dvh",
          borderEndStartRadius: "xl",
          borderStartStartRadius: "xl",
          inlineSize: "var(--drawer-size)",
          insetBlock: 0,
          insetInlineEnd: 0,
          insetInlineStart: "auto",
        },
      },
      start: {
        root: {
          "--drawer-offset": "translateX(-100%)",
          blockSize: "100dvh",
          borderEndEndRadius: "xl",
          borderStartEndRadius: "xl",
          inlineSize: "var(--drawer-size)",
          insetBlock: 0,
          insetInlineEnd: "auto",
          insetInlineStart: 0,
        },
      },
      top: {
        root: {
          "--drawer-offset": "translateY(-100%)",
          blockSize: "var(--drawer-size)",
          borderEndEndRadius: "xl",
          borderEndStartRadius: "xl",
          inlineSize: "100dvw",
          insetBlockEnd: "auto",
          insetBlockStart: 0,
          insetInline: 0,
          maxBlockSize: "85dvh",
        },
      },
    },
  },
  sizes: {
    xs: { root: { "--drawer-size": "{sizes.xs}" } },
    sm: { root: { "--drawer-size": "{sizes.sm}" } },
    md: { root: { "--drawer-size": "{sizes.md}" } },
    lg: { root: { "--drawer-size": "{sizes.lg}" } },
    xl: { root: { "--drawer-size": "{sizes.xl}" } },
    full: {
      root: {
        "--drawer-size": "100%",
        borderRadius: "none",
        maxBlockSize: "100dvh",
      },
    },
  },
  defaultProps: {
    root: {
      size: "md",
      placement: "end",
    },
  },
})

export type DrawerStyle = typeof drawerStyle
