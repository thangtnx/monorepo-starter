import type { ComponentProps } from "react"
import type { ComponentStyleProps } from "../../core/define"
import { splitStyleProps } from "../../core/split-style-props"
import { textStyle } from "./text.style"

interface TextStyleProps extends ComponentStyleProps<typeof textStyle> {
  /**
   * The visual typography preset.
   *
   * @default "body"
   */
  variant?: keyof typeof textStyle.variants
}

interface ParagraphProps
  extends TextStyleProps, Omit<ComponentProps<"p">, "color"> {
  /** @default "p" */
  as?: "p"
}

interface SpanProps
  extends TextStyleProps, Omit<ComponentProps<"span">, "color"> {
  /** Render the text inline. */
  as: "span"
}

export type TextProps = ParagraphProps | SpanProps

export function Text(props: TextProps) {
  const { ref, as, ...rest } = props
  const [styleAttributes, elementProps] = splitStyleProps(
    "text",
    textStyle,
    rest,
  )

  if (as === "span")
    return <span {...styleAttributes} {...elementProps} ref={ref} />

  return <p {...styleAttributes} {...elementProps} ref={ref} />
}
