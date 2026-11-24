import type { StorybookConfig } from "@storybook/react-vite"

const config: StorybookConfig = {
  addons: ["@storybook/addon-a11y", "@storybook/addon-docs"],
  core: { disableTelemetry: true },
  framework: "@storybook/react-vite",
  stories: ["../src/**/*.stories.tsx"],
}

export default config
