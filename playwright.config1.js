// @ts-check
const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests", // Folder that contains your tests
  retries: 1, //retry once when test failed
  workers: 3, //execute 3 test files in parallel instead of default 5

  // Maximum time a test can run before failure (30 seconds)
  timeout: 30 * 1000,
  expect: {
    timeout: 5000, // Timeout for assertions (5 seconds)
  },
  reporter: "html", // Generates test report

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  projects: [
    {
      name: "Safari",
      use: {
        browserName: "webkit",
        headless: false, // True to run without opening browser
        screenshot: "on", // Take screenshot for every step
        trace: "retain-on-failure", // Retain trace on failure

        // Device to run
        //...devices["iPhone 11"],

        // Ignore and accept websites with no SSL
        ignoreHttpsErrors: true,

        // Accept popups demanding to know location
        permissions: ["geolocation"],

        // This allows browser width justification
        // viewport: { width: 740, height: 740 },
      },
    },
    {
      name: "Chrome",
      use: {
        browserName: "chromium",
        headless: false,
        screenshot: "on",
        // Record video on test failure
        video: "retain-on-failure",
        //video: "on",
        ignoreHttpsErrors: true,
        permissions: ["geolocation"],
        trace: "on", // Trace on

        // Device to run
        // ...devices["iPad (gen 5)"],

        // This allows browser width justification
        //viewport: { width: 720, height: 720 },
      },
    },
  ],
});
