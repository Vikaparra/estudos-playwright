const { devices } = require("@playwright/test");

const config = {
  testDir: "./tests",
  timeout: 30 * 1000,
  expect: {
    timeout: 7000,
  },
  reporter: "html",
  use: {
    //headless: false,
    browserName: "chromium",
    actionTimeout: 0,
    //trace: "on",
    screenshot: "on",
  },
};

module.exports = config;
