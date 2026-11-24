import { schemeColors } from "./color-schemes"

export const colors = {
  bg: {
    base: ["{colors.white}", "{colors.gray.950}"],
    emphasized: ["{colors.gray.200}", "{colors.gray.700}"],
    muted: ["{colors.gray.100}", "{colors.gray.800}"],
    panel: ["{colors.white}", "{colors.gray.900}"],
    subtle: ["{colors.gray.50}", "{colors.gray.900}"],
  },
  border: {
    base: ["{colors.gray.200}", "{colors.gray.800}"],
    // Control borders: at least 3:1 against the page in both modes.
    emphasized: ["{colors.gray.500}", "{colors.gray.500}"],
    muted: ["{colors.gray.100}", "{colors.gray.900}"],
  },
  danger: schemeColors.danger,
  fg: {
    base: ["{colors.gray.950}", "{colors.gray.50}"],
    muted: ["{colors.gray.600}", "{colors.gray.400}"],
  },
  focusRing: ["{colors.blue.600}", "{colors.blue.400}"],
  info: schemeColors.info,
  neutral: schemeColors.neutral,
  primary: schemeColors.primary,
  success: schemeColors.success,
  warning: schemeColors.warning,
} as const
