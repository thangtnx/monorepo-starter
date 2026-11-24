const enabled = ":where(:not(:disabled, [data-disabled], [aria-disabled=true]))"

/** Shorthand keys usable in style objects, mapped to selectors or at-rules. */
export const conditions: { [key: string]: string } = {
  _after: "&::after",
  _before: "&::before",
  _checked: "&:checked, &[aria-checked=true], &[data-checked]",
  _focusWithin: "&:focus-within",
  _icon: "& svg",
  _motionReduce: "@media (prefers-reduced-motion: reduce)",
  _placeholder: "&::placeholder",
  _print: "@media print",
  _hover: `&:hover${enabled}`,
  _active: `&:active${enabled}`,
  _focus: "&:focus",
  _focusVisible: "&:focus-visible",
  _invalid: "&[aria-invalid=true], &[data-invalid]",
  _readOnly: "&[readonly], &[aria-readonly=true], &[data-readonly]",
  _disabled: "&:disabled, &[data-disabled], &[aria-disabled=true]",
}
