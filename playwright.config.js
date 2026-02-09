const { defineConfig, devices } = require('@playwright/test');
const ENV = require('./config/env');

const isCI = !!process.env.CI;

module.exports = defineConfig({

testDir: './tests',

/* Prevent infinite pipeline runs */
globalTimeout: 60 * 60 * 1000, // 1 hour

/* Per test timeout */
timeout: 30 * 1000,

expect: {
timeout: 5000,
},

/* Faster locally, safer in CI */
fullyParallel: !isCI,

/* Retries help eliminate flaky failures in CI */
retries: isCI ? 2 : 0,

/* Avoid overloading CI machines */
workers: isCI ? 2 : undefined,

/* Better reporter for CI readability */
reporter: isCI
? [['dot'], ['html']]
: [['list'], ['html']],

use: {
baseURL: ENV.baseUrl,


/* Headed locally for debugging, headless in CI */
headless: isCI,

viewport: { width: 1280, height: 720 },

ignoreHTTPSErrors: true,

/* Artifacts for debugging failures */
screenshot: 'only-on-failure',
video: 'retain-on-failure',
trace: 'on-first-retry',

/* Helps when tests randomly hang */
actionTimeout: 15000,
navigationTimeout: 30000,


},

/* Example multi-browser setup (VERY valued in companies) */
projects: [
{
name: 'chromium',
use: { ...devices['Desktop Chrome'] },
},

// ```
// // ⭐ Uncomment when needed — don’t slow yourself early
// // {
// //   name: 'firefox',
// //   use: { ...devices['Desktop Firefox'] },
// // },
// // {
// //   name: 'webkit',
// //   use: { ...devices['Desktop Safari'] },
// // },
// ```

],
});
