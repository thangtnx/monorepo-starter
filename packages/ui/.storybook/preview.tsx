/// <reference types="vite/client" />

import type { Decorator, Preview } from "@storybook/react-vite"
import { componentStyles } from "../src/component-styles"
import { createCss } from "../src/core"
import { theme } from "../src/theme"

const stylesheet = document.createElement("style")
stylesheet.textContent = createCss(theme, componentStyles)
document.head.append(stylesheet)

if (import.meta.hot) {
  let currentTheme = theme
  let currentStyles = componentStyles

  import.meta.hot.accept(
    ["../src/theme", "../src/component-styles"],
    ([themeModule, stylesModule]) => {
      currentTheme = themeModule?.theme ?? currentTheme
      currentStyles = stylesModule?.componentStyles ?? currentStyles
      stylesheet.textContent = createCss(currentTheme, currentStyles)
    },
  )
  import.meta.hot.dispose(() => stylesheet.remove())
}

const withMode: Decorator = (Story, { globals }) => (
  <div
    style={{
      background: "var(--colors-bg)",
      color: "var(--colors-fg)",
      fontFamily: "var(--fonts-body)",
      minHeight: "100vh",
      padding: "var(--spaces-6)",
    }}
    data-mode={globals.mode as string}
  >
    <Story />
  </div>
)

const preview: Preview = {
  decorators: [withMode],
  globalTypes: {
    mode: {
      description: "Color mode",
      toolbar: {
        dynamicTitle: true,
        icon: "mirror",
        items: [
          { title: "Light", value: "light" },
          { title: "Dark", value: "dark" },
        ],
      },
    },
  },
  initialGlobals: { mode: "light" },
  parameters: {
    a11y: { test: "error" },
    layout: "fullscreen",
  },
  tags: ["autodocs"],
}

export default preview
