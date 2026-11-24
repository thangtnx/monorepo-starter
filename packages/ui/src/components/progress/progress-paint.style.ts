import { defineComponentStyle } from "../../core/define"

export const progressPaintStyle = defineComponentStyle({
  variants: {
    outline: {
      "--progress-range": "{colors.colorScheme.solid}",
      "--progress-track": "{colors.bg.emphasized}",
    },
    subtle: {
      "--progress-range": "{colors.colorScheme.outline}",
      "--progress-track": "{colors.colorScheme.subtle}",
    },
  },
})
