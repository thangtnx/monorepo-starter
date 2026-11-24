import { GLOBALS_UPDATED, SET_GLOBALS } from "storybook/internal/core-events"
import { PANEL_ID } from "storybook/internal/docs-tools"
import { addons } from "storybook/manager-api"
import { create } from "storybook/theming"
import { colors } from "../src/theme/tokens/colors"
import { fonts } from "../src/theme/tokens/fonts"

const canvas = document.createElement("canvas")
canvas.width = canvas.height = 1
const pixel = canvas.getContext("2d")!

// The manager derives translucent colors from its theme, so give it sRGB values.
function rgb(color: string) {
  pixel.fillStyle = color
  pixel.fillRect(0, 0, 1, 1)
  const [red, green, blue] = pixel.getImageData(0, 0, 1, 1).data
  return `rgb(${red}, ${green}, ${blue})`
}

function managerTheme(base: "dark" | "light") {
  const dark = base === "dark"
  const surface = rgb(dark ? colors.gray[900] : colors.gray[50])
  const canvas = rgb(dark ? colors.gray[950] : colors.white)
  const foreground = rgb(dark ? colors.gray[50] : colors.gray[950])
  const accent = rgb(dark ? colors.blue[400] : colors.blue[700])
  const border = rgb(dark ? colors.gray[700] : colors.gray[200])
  return create({
    base,
    appBg: surface,
    appBorderColor: border,
    appContentBg: canvas,
    appHoverBg: rgb(dark ? colors.gray[800] : colors.gray[100]),
    appPreviewBg: canvas,
    barBg: surface,
    barTextColor: foreground,
    brandTitle: "@monorepo/ui",
    colorPrimary: accent,
    colorSecondary: accent,
    fontBase: fonts.body,
    fontCode: fonts.mono,
    inputBg: canvas,
    inputBorder: border,
    inputTextColor: foreground,
    textColor: foreground,
    textMutedColor: rgb(dark ? colors.gray[300] : colors.gray[600]),
  })
}

const themes = { light: managerTheme("light"), dark: managerTheme("dark") }
const modeStorageKey = "monorepo-storybook-mode"

function getInitialTheme() {
  try {
    return window.localStorage.getItem(modeStorageKey) === "dark"
      ? themes.dark
      : themes.light
  } catch {
    return themes.light
  }
}

addons.setConfig({
  layout: { panelPosition: "bottom" },
  selectedPanel: PANEL_ID,
  theme: getInitialTheme(),
})

addons.register("monorepo/color-mode", (api) => {
  const applyMode = ({ globals }: { globals?: { mode?: unknown } }) => {
    const mode = globals?.mode
    if (mode !== "dark" && mode !== "light") return

    api.setOptions({ theme: themes[mode] })
    try {
      window.localStorage.setItem(modeStorageKey, mode)
    } catch {
      // The toolbar still applies the theme when storage is unavailable.
    }
  }
  api.on(SET_GLOBALS, applyMode)
  api.on(GLOBALS_UPDATED, applyMode)
})
