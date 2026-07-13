// @ts-check
const { defineConfig } = require("@playwright/test");

// The behaviour contract. The Meridian dashboard must work at every size,
// so the suite runs at mobile, tablet, and desktop widths. Chromium only,
// to keep the browser download small and fast on locked-down laptops.

const PORT = 5173;
const baseURL = `http://localhost:${PORT}`;

module.exports = defineConfig({
  testDir: "./tests",
  timeout: 30000,
  expect: { timeout: 5000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "mobile",
      use: { browserName: "chromium", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
    },
    {
      name: "tablet",
      use: { browserName: "chromium", viewport: { width: 768, height: 1024 } },
    },
    {
      name: "desktop",
      use: { browserName: "chromium", viewport: { width: 1280, height: 800 } },
    },
  ],
  webServer: {
    command: `npx serve . -l ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
});
