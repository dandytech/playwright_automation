// @ts-check
const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests", //folder that contains your test
  retries: 2, //rerun failed test 2 times

  // Maximum time test can wait run before failure 30 sec
  timeout: 30 * 1000,
  expect: {
    timeout: 5000, //timeout for assertion 5 sec
  },
  reporter: "html", //this generates test report
  //reporter: "allure-playwright",

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    browserName: "firefox", //webkit’ for safari, ‘chromium’ for chrome
    headless: true, //to open browser when executing
    screenshot: "on", //take screenshot for every step in test
    //trace: "on", //collect log of every test passed or failed
    trace: "retain-on-failure", //capture log only when test fail
  },
});
