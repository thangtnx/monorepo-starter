import type { StorybookConfig } from "@storybook/react-vite"

const config: StorybookConfig = {
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  core: { disableTelemetry: true },
  features: {
    actions: false,
    backgrounds: false,
    controls: false,
    interactions: false,
  },
  framework: "@storybook/react-vite",
  stories: ["../src/**/*.stories.tsx"],
}

export default config
