import { toKebab } from "./tokens"

export const componentClassName = (name: string) => `ui-${name}`

export const slotClassName = (name: string, slot: string) =>
  slot === "root"
    ? componentClassName(name)
    : `${componentClassName(name)}__${slot}`

export const styleAttributeName = (prop: string) =>
  `data-${prop === "colorScheme" ? "scheme" : toKebab(prop)}` as const
