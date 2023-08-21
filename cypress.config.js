const { defineConfig } = require('cypress')

module.exports = defineConfig({
  chromeWebSecurity: false,
  watchForFileChanges: false,
  video: false,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  viewportWidth: 1920,
  viewportHeight: 1080,
  defaultCommandTimeout: 60000,
  execTimeout: 60000,
  pageLoadTimeout: 60000,
  requestTimeout: 60000,
  responseTimeout: 60000,
  blockHosts: [
  ],
  env: {
    apiUrl: 'https://admin-api-shared.staging.exberry-uat.io',
    wsUrl: 'wss://sandbox-shared.staging.exberry-uat.io',
  },
  e2e: {
    setupNodeEvents(on, config) {
    },
    specPattern: 'cypress/tests/**/*.{js,jsx,ts,tsx}',
  },
})