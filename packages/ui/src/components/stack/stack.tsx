import type { ComponentProps } from "react"
import type { ComponentStyleProps } from "../../core/define"
import { splitStyleProps } from "../../core/split-style-props"
import { stackStyle } from "./stack.style"

export interface StackProps
  extends
    Omit<ComponentProps<"div">, "color">,
    ComponentStyleProps<typeof stackStyle> {
  /** How items align across the stack. */
  align?: keyof typeof stackStyle.props.align
  /**
   * The axis along which items flow.
   *
   * @default "column"
   */
  direction?: keyof typeof stackStyle.props.direction
  /**
   * The space token between items, or `"0"` for no gap.
   *
   * @default "4"
   */
  gap?: keyof typeof stackStyle.props.gap
  /** How items are distributed along the stack. */
  justify?: keyof typeof stackStyle.props.justify
}

export function Stack(props: StackProps) {
  const [styleAttributes, rest] = splitStyleProps("stack", stackStyle, props)

  return <div {...styleAttributes} {...rest} />
}
