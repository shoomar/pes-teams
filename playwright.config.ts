import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	// Look for test files in the "tests" directory, relative to this configuration file.
	testDir : './tests/playwright',

	// Run all tests in parallel.
	fullyParallel : true,

	// Fail the build on CI if you accidentally left test.only in the source code.
	forbidOnly : !!process.env.CI,

	// Retry on CI only.
	retries : process.env.CI ? 2 : 0,

	// Opt out of parallel tests on CI.
	workers : process.env.CI ? 1 : undefined,

	// Reporter to use
	reporter : 'html',

	// Folder for test artifacts such as screenshots, videos, traces, etc.
	outputDir : 'test-results',

	use : {
		// Base URL to use in actions like `await page.goto('/')`.
		baseURL : 'http://127.0.0.1:3000',

		// Populates context with given storage state.
		// storageState: './tests/state.json',

		// Collect trace when retrying the failed test.
		trace : 'on-first-retry',

		// slow down all actions
		launchOptions : {
			slowMo : 250
		}
	},

	// Maximum time for test
	timeout  : 5 * 60 * 1000,
	// Configure projects for major browsers.
	projects : [
		{
			name : 'chromium',
			use  : { ...devices['Desktop Chrome'] },
		},
	],
	// Run your local dev server before starting the tests.
	webServer : {
		command             : 'npm run test',
		url                 : 'http://127.0.0.1:3000',
		reuseExistingServer : !process.env.CI,
	},
});