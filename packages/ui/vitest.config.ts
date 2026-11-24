import { defineProject, mergeConfig } from "@monorepo/workspace/vitest"
import sharedConfig from "@monorepo/workspace/vitest/config"

export default mergeConfig(sharedConfig, {
  test: {
    projects: [
      defineProject({
        test: {
          name: "jsdom",
          environment: "jsdom",
          globals: true,
          include: ["src/**/*.test.{ts,tsx}"],
          setupFiles: ["@monorepo/workspace/vitest/setup"],
        },
      }),
    ],
  },
})
