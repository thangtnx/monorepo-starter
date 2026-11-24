import type { StackProps } from "./stack"
import { Stack } from "./stack"

export interface VStackProps extends Omit<StackProps, "direction"> {}

export function VStack(props: VStackProps) {
  return <Stack {...props} direction="column" />
}
