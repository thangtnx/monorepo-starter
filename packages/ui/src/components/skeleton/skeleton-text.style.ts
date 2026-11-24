import { defineComponentStyle } from "../../core/define"

export const skeletonTextStyle = defineComponentStyle({
  base: {
    "& > [data-loading='true']:last-child:not(:first-child)": {
      maxWidth: "80%",
    },
    "@supports (gap: attr(data-gap type(<length>)))": {
      gap: "attr(data-gap type(<length>), {spaces.2})",
    },
    display: "grid",
    gap: "2",
  },
})
