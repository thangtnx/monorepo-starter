import type { Decorator, Preview } from "@storybook/react-vite"
import "../dist/styles.css"

// The stories read the same generated stylesheet the app ships; `data-mode`
// on the wrapper switches the semantic tokens like it does on `<html>`.
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
