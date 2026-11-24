import {
  createNoRestrictedImportConfig,
  defineConfig,
  reactConfig,
  sharedConfig,
} from "@monorepo/workspace/oxlint"

export default defineConfig({
  extends: [sharedConfig, reactConfig, createNoRestrictedImportConfig()],
  ignorePatterns: ["dist", "coverage"],
})
