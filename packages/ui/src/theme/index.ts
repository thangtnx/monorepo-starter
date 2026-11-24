import { defineTheme } from "../core/define"
import { colorSchemeRoles, colorSchemes } from "./semantic-tokens/color-schemes"
import { colors } from "./semantic-tokens/colors"
import { shadows } from "./semantic-tokens/shadows"
import { globalStyle } from "./styles/global-style"
import { layerStyles } from "./styles/layer-styles"
import { resetStyle } from "./styles/reset-style"
import { textStyles } from "./styles/text-styles"
import { tokens } from "./tokens"

export type { ColorScheme } from "./semantic-tokens/color-schemes"

export const theme = defineTheme({
  colorSchemeRoles,
  colorSchemes,
  globalStyle,
  layerStyles,
  resetStyle,
  semanticTokens: { colors, shadows },
  textStyles,
  tokens,
})
