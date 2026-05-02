const { defineConfig } = require('@playwright/test');
const path = require('node:path');

module.exports = defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4210',
    trace: 'on-first-retry'
  },
  webServer: {
    command: 'npm start -- --port 4210',
    cwd: path.resolve(__dirname),
    url: 'http://localhost:4210',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
});