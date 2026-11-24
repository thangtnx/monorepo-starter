/// <reference types="vite/client" />

import type { Decorator, Preview } from "@storybook/react-vite"
import type { ReactNode } from "react"
import { useLayoutEffect } from "react"
import { componentStyles } from "../src/component-styles"
import { createCss } from "../src/core"
import { theme } from "../src/theme"
import "./preview.css"

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

function ModeFrame({
  children,
  fullscreen,
  mode,
}: {
  children: ReactNode
  fullscreen: boolean
  mode: "dark" | "light"
}) {
  useLayoutEffect(() => {
    document.documentElement.dataset.mode = mode
  }, [mode])

  return (
    <div
      style={{
        background: "var(--colors-bg)",
        color: "var(--colors-fg)",
        fontFamily: "var(--fonts-body)",
        minHeight: fullscreen ? "100vh" : undefined,
        padding: "var(--spaces-6)",
      }}
    >
      {children}
    </div>
  )
}

const withMode: Decorator = (Story, { globals, viewMode }) => (
  <ModeFrame
    fullscreen={viewMode === "story"}
    mode={globals.mode === "dark" ? "dark" : "light"}
  >
    <Story />
  </ModeFrame>
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
