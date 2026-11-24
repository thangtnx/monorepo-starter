import { defineComponentStyle } from "../../core/define"

export const gridItemStyle = defineComponentStyle({
  base: {
    "&[data-area]": { gridArea: "var(--grid-area)" },
    "&[data-column]": { gridColumn: "var(--grid-column)" },
    "&[data-row]": { gridRow: "var(--grid-row)" },
    "--grid-area": "auto",
    "--grid-column": "auto",
    "--grid-row": "auto",
  },
})
