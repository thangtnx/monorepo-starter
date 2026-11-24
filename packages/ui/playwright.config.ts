import { defineConfig, devices } from "@playwright/test"

const port = 6007
const baseURL = `http://localhost:${port}`

export default defineConfig({
  expect: { timeout: 10_000 },
  forbidOnly: !!process.env.CI,
  fullyParallel: true,
  outputDir: "test-results",
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  reporter: [["list"], ["html", { open: "never" }]],
  retries: process.env.CI ? 2 : 0,
  testDir: "e2e",
  use: {
    baseURL,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: "retain-on-failure",
  },
  // Serves the static catalog from `pnpm ui build:storybook` with the
  // workspace's own vite.
  webServer: {
    command: `pnpm exec vite preview --outDir storybook-static --port ${port} --strictPort`,
    reuseExistingServer: !process.env.CI,
    url: baseURL,
  },
  workers: process.env.CI ? 2 : 3,
})
