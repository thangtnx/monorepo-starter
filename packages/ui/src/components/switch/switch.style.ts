import { defineComponentStyle } from "../../core/define"
import { checkboxStyle } from "../checkbox/checkbox.style"

export const switchStyle = defineComponentStyle({
  base: {
    ...checkboxStyle.base,
    "&::before": {
      backgroundColor: "fg.muted",
      borderRadius: "full",
      content: '""',
      height: "calc(var(--switch-height) - 0.375rem)",
      width: "calc(var(--switch-height) - 0.375rem)",
    },
    "&:checked": {
      "&::before": {
        backgroundColor:
          "var(--color-scheme-contrast, {colors.primary.contrast})",
        justifySelf: "end",
      },
      backgroundColor: "var(--color-scheme-solid, {colors.primary.solid})",
      borderColor: "transparent",
    },
    "@media (forced-colors: active)": {
      "&::before": { display: "none" },
      appearance: "auto",
    },
    alignItems: "center",
    appearance: "none",
    backgroundColor: "bg.muted",
    borderColor: "border.emphasized",
    borderRadius: "full",
    borderWidth: "1px",
    display: "inline-grid",
    paddingInline: "0.125rem",
  },
  sizes: {
    sm: { "--switch-height": "{sizes.4}", height: "4", width: "7" },
    md: { "--switch-height": "{sizes.5}", height: "5", width: "9" },
    lg: {
      ...checkboxStyle.sizes.lg,
      "--switch-height": "{sizes.11}",
      width: "20",
    },
  },
  defaultProps: { size: "md" },
})
