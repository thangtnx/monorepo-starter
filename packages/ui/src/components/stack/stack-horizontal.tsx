import type { StackProps } from "./stack"
import { Stack } from "./stack"

export interface HStackProps extends Omit<StackProps, "direction"> {}

export function HStack(props: HStackProps) {
  return <Stack {...props} direction="row" />
}
