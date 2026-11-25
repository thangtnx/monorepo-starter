import { defineComponentStyle } from "../../core/define"

export const toastStyle = defineComponentStyle({
  base: {
    "& > *": {
      boxShadow: "0 4px 12px rgb(0 0 0 / 0.14), 0 0 1px rgb(0 0 0 / 0.25)",
      pointerEvents: "auto",
    },
    display: "flex",
    flexDirection: "column",
    gap: "2",
    maxInlineSize: "min(100dvw, {sizes.sm})",
    padding: "4",
    pointerEvents: "none",
    position: "fixed",
    width: "full",
    zIndex: "toast",
  },
  props: {
    /**
     * Viewport edge and alignment where toasts stack.
     *
     * @default "bottom-end"
     */
    placement: {
      bottom: { bottom: 0, left: "50%", transform: "translateX(-50%)" },
      "bottom-end": { bottom: 0, insetInlineEnd: 0 },
      "bottom-start": { bottom: 0, insetInlineStart: 0 },
      top: { left: "50%", top: 0, transform: "translateX(-50%)" },
      "top-end": { insetInlineEnd: 0, top: 0 },
      "top-start": { insetInlineStart: 0, top: 0 },
    },
  },
  defaultProps: {
    placement: "bottom-end",
  },
})

export type ToastStyle = typeof toastStyle
