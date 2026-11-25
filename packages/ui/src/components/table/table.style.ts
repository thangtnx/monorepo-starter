import { defineComponentSlotStyle } from "../../core/define"

export const tableStyle = defineComponentSlotStyle({
  base: {
    body: {},
    caption: {
      color: "fg.muted",
      fontSize: "sm",
      paddingBlock: "3",
      textAlign: "center",
    },
    cell: {
      "&[data-numeric=true]": {
        fontVariantNumeric: "tabular-nums",
        textAlign: "end",
      },
      verticalAlign: "middle",
    },
    footer: {
      fontWeight: "medium",
    },
    head: {
      "&[data-numeric=true]": {
        fontVariantNumeric: "tabular-nums",
        textAlign: "end",
      },
      color: "fg.muted",
      fontWeight: "semibold",
      textAlign: "start",
      verticalAlign: "middle",
    },
    header: {},
    root: {
      borderCollapse: "collapse",
      color: "fg",
      textAlign: "start",
      width: "full",
    },
    row: {
      borderBlockEndColor: "border",
      borderBlockEndWidth: "1px",
      transitionDuration: "fast",
      transitionProperty: "background-color",
    },
    scrollArea: {
      overflow: "auto",
      width: "full",
    },
  },
  props: {
    /**
     * Highlights body rows when hovered.
     *
     * @default false
     */
    highlightOnHover: {
      false: {},
      true: {
        body: {
          "& > tr:hover": { background: "bg.muted" },
        },
      },
    },
    /**
     * Pins the header row to the top of its scroll container.
     *
     * @default false
     */
    stickyHeader: {
      false: {},
      true: {
        header: {
          background: "bg",
          position: "sticky",
          top: 0,
          zIndex: "docked",
        },
      },
    },
    /**
     * Alternating row background tint in the table body.
     *
     * @default false
     */
    striped: {
      false: {},
      true: {
        body: {
          "& > tr:nth-child(even)": { background: "colorScheme.subtle" },
        },
      },
    },
    /**
     * Renders an outer border around the table.
     *
     * @default false
     */
    withBorder: {
      false: {},
      true: {
        root: { borderColor: "border", borderWidth: "1px" },
      },
    },
    /**
     * Draws vertical dividers between columns.
     *
     * @default false
     */
    withColumnBorders: {
      false: {},
      true: {
        cell: {
          "&:not(:last-child)": {
            borderInlineEndColor: "border",
            borderInlineEndWidth: "1px",
          },
        },
        head: {
          "&:not(:last-child)": {
            borderInlineEndColor: "border",
            borderInlineEndWidth: "1px",
          },
        },
      },
    },
  },
  sizes: {
    sm: {
      cell: { fontSize: "sm", paddingBlock: "2", paddingInline: "3" },
      head: { fontSize: "xs", paddingBlock: "2", paddingInline: "3" },
    },
    md: {
      cell: { fontSize: "sm", paddingBlock: "3", paddingInline: "4" },
      head: { fontSize: "xs", paddingBlock: "3", paddingInline: "4" },
    },
    lg: {
      cell: { fontSize: "md", paddingBlock: "4", paddingInline: "5" },
      head: { fontSize: "sm", paddingBlock: "4", paddingInline: "5" },
    },
  },
  variants: {
    line: {
      header: {
        borderBlockEndColor: "border",
        borderBlockEndWidth: "1px",
      },
    },
    outline: {
      header: { background: "bg.subtle" },
      root: { borderColor: "border", borderWidth: "1px" },
    },
  },
  defaultProps: {
    root: {
      colorScheme: "neutral",
      size: "md",
      variant: "line",
      highlightOnHover: false,
      stickyHeader: false,
      striped: false,
      withBorder: false,
      withColumnBorders: false,
    },
  },
})

export type TableStyle = typeof tableStyle
