import { defineComponentStyle } from "../../core/define"

export const skeletonTextStyle = defineComponentStyle({
  base: {
    "& > [data-loading='true']:last-child:not(:first-child)": {
      maxWidth: "80%",
    },
    "--skeleton-gap": "initial",
    display: "grid",
    gap: "var(--skeleton-gap, {spaces.2})",
  },
})
