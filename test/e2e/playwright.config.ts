import { devices } from "@playwright/test";
import type { PlaywrightTestConfig } from "@playwright/test";

const port = parseInt(process.env.VITE_PORT ?? "3001"); // not 3000 to not interfere with local deployment
const timeout = parseInt(process.env.WAIT_ON_TIMEOUT ?? `${20 * 1000}`);

const config: PlaywrightTestConfig = {
  testDir: ".",
  timeout: 10000,
  retries: process.env.CI === "true" ? 1 : 0,
  use: {
    viewport: { width: 1280, height: 720 },
    acceptDownloads: true,
    baseURL: `http://localhost:${port}`,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  reporter: [
    [process.env.CI ? "github" : "list"],
    ["html", { outputFolder: "./playwright-report" }],
  ],
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], channel: "chrome" },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  webServer: {
    command: `DEV_TOOLS=false npm run dev -- --port ${port}`,
    port,
    timeout,
  },
};

export default config;
