/// <reference types="vite/client" />

import type { Decorator, Preview, StoryContext } from "@storybook/react-vite"
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
  layout,
  mode,
}: {
  children: ReactNode
  mode: "dark" | "light"
  layout?: string
}) {
  useLayoutEffect(() => {
    document.documentElement.dataset.mode = mode
  }, [mode])

  if (!layout || layout === "unstyled") return children

  return <div className={`sb-canvas-${layout}`}>{children}</div>
}

const withCanvas: Decorator = (Story, { globals, parameters, viewMode }) => (
  <ModeFrame
    layout={viewMode === "story" ? parameters.layout : undefined}
    mode={globals.mode === "dark" ? "dark" : "light"}
  >
    <Story />
  </ModeFrame>
)

const preview: Preview = {
  decorators: [withCanvas],
  globalTypes: {
    mode: {
      description: "Color mode",
      toolbar: {
        dynamicTitle: true,
        items: [
          { icon: "sun", title: "Light", value: "light" },
          { icon: "moon", title: "Dark", value: "dark" },
        ],
      },
    },
  },
  initialGlobals: { mode: "light" },
  parameters: {
    a11y: { test: "error" },
    docs: {
      codePanel: true,
      source: {
        transform: (snippet: string, { parameters }: StoryContext) => {
          const original: string | undefined =
            parameters.docs?.source?.originalSource
          // Serializing React elements loses their render callbacks and can expose minified names.
          return original && /^\s*render:/m.test(original) ? original : snippet
        },
      },
    },
    layout: "fullscreen",
    options: {
      storySort: {
        includeNames: true,
        method: "alphabetical",
        order: [
          "Theme",
          "Components",
          ["*", ["Basic", "Variant", "Size", "Color Scheme", "*", "Docs"]],
        ],
      },
    },
  },
}

export default preview
