import type { ComponentProps } from "react"
import type { ComponentStyleProps } from "../../core/define"
import { splitStyleProps } from "../../core/split-style-props"
import { containerStyle } from "./container.style"

export interface ContainerProps
  extends
    Omit<ComponentProps<"div">, "color">,
    ComponentStyleProps<typeof containerStyle> {
  /**
   * The maximum content width preset.
   *
   * @default "lg"
   */
  size?: keyof typeof containerStyle.sizes
}

export function Container(props: ContainerProps) {
  const [styleAttributes, rest] = splitStyleProps(
    "container",
    containerStyle,
    props,
  )

  return <div {...styleAttributes} {...rest} />
}
