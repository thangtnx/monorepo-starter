import { defineTheme } from "../core/define"
import {
  colorSchemeRoles,
  colorSchemes,
  semanticTokens,
} from "./semantic-tokens"
import { globalStyle, layerStyles, resetStyle, textStyles } from "./styles"
import { tokens } from "./tokens"

export type { ColorScheme } from "./semantic-tokens"

export const theme = defineTheme({
  colorSchemeRoles,
  colorSchemes,
  globalStyle,
  layerStyles,
  resetStyle,
  semanticTokens,
  textStyles,
  tokens,
})
