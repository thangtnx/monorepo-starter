import { defineComponentSlotStyle } from "../../core/define"

export const tabsStyle = defineComponentSlotStyle({
  base: {
    list: {
      display: "flex",
      position: "relative",
    },
    panel: {
      "&[hidden]": { display: "none" },
    },
    panels: {
      flex: "1",
      minWidth: "0",
    },
    root: {
      display: "flex",
      gap: "3",
      width: "full",
    },
    tab: {
      alignItems: "center",
      appearance: "none",
      background: "transparent",
      borderColor: "transparent",
      borderStyle: "solid",
      borderWidth: "0",
      color: "fg.muted",
      cursor: "pointer",
      display: "inline-flex",
      fontWeight: "medium",
      gap: "2",
      justifyContent: "center",
      position: "relative",
      transitionDuration: "fast",
      transitionProperty: "background-color, border-color, color, box-shadow",
      transitionTimingFunction: "standard",
      userSelect: "none",
      whiteSpace: "nowrap",
      _hover: { color: "fg" },
      _disabled: { layerStyle: "disabled" },
    },
  },
  compounds: [
    {
      css: {
        list: {
          borderBlockEndWidth: "0",
          borderInlineEndColor: "border",
          borderInlineEndStyle: "solid",
          borderInlineEndWidth: "1px",
        },
        tab: {
          "&[aria-selected=true]": {
            borderBlockEndColor: "transparent",
            borderInlineEndColor: "colorScheme.solid",
          },
          borderBlockEndWidth: "0",
          borderInlineEndWidth: "2px",
          justifyContent: "flex-start",
          marginBlockEnd: "0",
          marginInlineEnd: "-1px",
        },
      },
      variant: "line",
      orientation: "vertical",
    },
    {
      css: {
        list: {
          borderBlockEndWidth: "0",
          borderInlineEndColor: "border",
          borderInlineEndStyle: "solid",
          borderInlineEndWidth: "1px",
        },
        tab: {
          "&[aria-selected=true]": {
            borderColor: "border",
            borderInlineEndColor: "bg",
          },
          borderEndStartRadius: "md",
          borderStartEndRadius: "none",
          borderStartStartRadius: "md",
          justifyContent: "flex-start",
          marginBlockEnd: "0",
          marginInlineEnd: "-1px",
        },
      },
      variant: "outline",
      orientation: "vertical",
    },
  ],
  props: {
    /**
     * Alignment of tabs within the tab list.
     *
     * @default "start"
     */
    align: {
      center: { list: { justifyContent: "center" } },
      end: { list: { justifyContent: "flex-end" } },
      start: { list: { justifyContent: "flex-start" } },
    },
    /**
     * If `true`, tabs stretch equally to fill the tab list.
     *
     * @default false
     */
    fitted: {
      false: {},
      true: { tab: { flex: "1" } },
    },
    /**
     * Layout and keyboard navigation direction.
     *
     * @default "horizontal"
     */
    orientation: {
      horizontal: {
        list: { flexDirection: "row", flexWrap: "wrap" },
        root: { flexDirection: "column" },
      },
      vertical: {
        list: { flexDirection: "column" },
        root: { flexDirection: "row" },
      },
    },
  },
  sizes: {
    sm: {
      tab: {
        fontSize: "sm",
        minBlockSize: "8",
        paddingBlock: "1",
        paddingInline: "3",
      },
    },
    md: {
      tab: {
        fontSize: "md",
        minBlockSize: "10",
        paddingBlock: "2",
        paddingInline: "4",
      },
    },
    lg: {
      tab: {
        fontSize: "md",
        // 44px minimum touch target on phones.
        minBlockSize: "11",
        paddingBlock: "2",
        paddingInline: "5",
      },
    },
  },
  variants: {
    enclosed: {
      list: {
        background: "bg.muted",
        borderRadius: "md",
        gap: "1",
        padding: "1",
      },
      tab: {
        "&[aria-selected=true]": {
          background: "bg.panel",
          boxShadow: "sm",
          color: "fg",
        },
        borderRadius: "sm",
      },
    },
    line: {
      list: {
        borderBlockEndColor: "border",
        borderBlockEndStyle: "solid",
        borderBlockEndWidth: "1px",
      },
      tab: {
        "&[aria-selected=true]": {
          borderBlockEndColor: "colorScheme.solid",
          color: "colorScheme.fg",
        },
        borderBlockEndWidth: "2px",
        marginBlockEnd: "-1px",
      },
    },
    outline: {
      list: {
        borderBlockEndColor: "border",
        borderBlockEndStyle: "solid",
        borderBlockEndWidth: "1px",
      },
      tab: {
        "&[aria-selected=true]": {
          background: "bg",
          borderBlockEndColor: "bg",
          borderColor: "border",
          color: "colorScheme.fg",
        },
        borderStartEndRadius: "md",
        borderStartStartRadius: "md",
        borderWidth: "1px",
        marginBlockEnd: "-1px",
      },
    },
    plain: {
      list: { gap: "1" },
      tab: {
        "&[aria-selected=true]": {
          color: "colorScheme.fg",
          fontWeight: "semibold",
        },
        borderRadius: "md",
      },
    },
    subtle: {
      list: { gap: "1" },
      tab: {
        "&[aria-selected=true]": {
          background: "colorScheme.subtle",
          color: "colorScheme.fg",
        },
        borderRadius: "md",
      },
    },
  },
  defaultProps: {
    root: {
      colorScheme: "primary",
      size: "md",
      variant: "line",
      align: "start",
      fitted: false,
      orientation: "horizontal",
    },
  },
})

export type TabsStyle = typeof tabsStyle
