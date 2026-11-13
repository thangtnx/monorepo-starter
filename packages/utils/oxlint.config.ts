import {
  createNoRestrictedImportConfig,
  defineConfig,
  sharedConfig,
} from "@monorepo/workspace/oxlint"

export default defineConfig({
  extends: [sharedConfig, createNoRestrictedImportConfig()],
  ignorePatterns: ["dist", "coverage"],
})
