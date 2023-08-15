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
  blockHosts: [
  ],
  env: {
    urlBase: 'https://admin-api-shared.staging.exberry-uat.io',
    apiUrl: 'https://admin-api-shared.staging.exberry-uat.io',
    wsUrl: 'wss://sandbox-shared.staging.exberry-uat.io',
  },
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    reporterEnabled: 'cypress-mochawesome-reporter, cypress-qase-reporter',
    cypressMochawesomeReporterReporterOptions: {
      charts: true,
    },
  },
  e2e: {
    setupNodeEvents(on, config) {
    },
    specPattern: 'cypress/tests/**/*.{js,jsx,ts,tsx}',
    experimentalRunAllSpecs: true,
  },
  experimentalWebKitSupport: true
})