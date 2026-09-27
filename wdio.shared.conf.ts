/**
 * WebdriverIO shared configuration.
 *
 * Mobile end-to-end automation framework for openIMIS, run via:
 *
 *   npm run test:ios        # iPhone 17 simulator (Xcode + XCUITest)
 *   npm run test:android    # Samsung Galaxy S25 emulator (Android Studio + UiAutomator2)
 *
 * The actual drivers (appium-xcuitest-driver, appium-uiautomator2-driver)
 * and emulators (Xcode, Android Studio) are NOT installed by this project —
 * they're dependencies of whoever runs the tests. This config is ready
 * to be used the moment `appium` + a driver + an emulator are available.
 */
import type { WebdriverIOConfig } from '@wdio/types';

const APPIUM_HOST = process.env.APPIUM_HOST ?? '127.0.0.1';
const APPIUM_PORT = process.env.APPIUM_PORT ?? '4723';
const APPIUM_URL = `http://${APPIUM_HOST}:${APPIUM_PORT}`;

export const config: WebdriverIOConfig = {
  runner: 'local',
  tsConfigPath: './tsconfig.json',

  // Use jasmine as the BDD framework.
  framework: 'jasmine',
  jasmineOpts: {
    defaultTimeoutInterval: 60_000,
  },

  // Reports
  reporters: [
    'spec',
    [
      'junit',
      { outputDir: './reports', outputFileFormat: 'xml' },
    ],
  ],

  // Default log level (can be overridden per-suite).
  logLevel: 'info',
  bail: 0,
  screenshotOnReject: true,
  frameworkMode: 'worker',

  // Default capabilities — overridden per-suite in wdio.android.conf.ts
  // and wdio.ios.conf.ts.
  maxInstances: 1,
  capabilities: [],

  // The WebdriverIO + Appium service connects to a running Appium server.
  // Start it locally with:  appium
  services: [
    [
      'appium',
      {
        command: 'appium',
        args: {
          address: APPIUM_HOST,
          port: Number(APPIUM_PORT),
        },
      },
    ],
  ],

  // Default test discovery — overridden per-suite if needed.
  specs: ['./tests/ui/**/*.spec.ts'],

  // 90s default — mobile UI can be slow under emulation.
  waitforTimeout: 10_000,
  connectionRetryTimeout: 90_000,
  connectionRetryCount: 3,

  // Project metadata.
  hostname: APPIUM_HOST,
  port: Number(APPIUM_PORT),
  path: '/wd/hub',
  baseUrl: APPIUM_URL,

  // We do not auto-watch — tests run on-demand.
  watch: false,
};

/** Run iOS suite: `npm run test:ios` */
export const iosConfig: Partial<WebdriverIOConfig> = {
  suite: 'ios',
  capabilities: [
    {
      // W3C + Appium capabilities
      platformName: 'iOS',
      'appium:deviceName': 'iPhone 17',
      'appium:platformVersion': '18.0',
      'appium:automationName': 'XCUITest',
      'appium:browserName': 'Safari',
      // openIMIS demo URL — Safari renders the mobile-web experience
      'appium:options': {
        bundleId: 'com.apple.mobilesafari',
        // openIMIS demo URL as the initial navigation
        safariInitialUrl: 'https://demo.openimis.org/front/login',
        // Wipe state between runs
        fullReset: true,
        // Keep the simulator responsive
        newCommandTimeout: 120,
      },
    } as any,
  ],
};

/** Run Android suite: `npm run test:android` */
export const androidConfig: Partial<WebdriverIOConfig> = {
  suite: 'android',
  capabilities: [
    {
      platformName: 'Android',
      'appium:deviceName': 'Samsung Galaxy S25',
      'appium:platformVersion': '15',
      'appium:automationName': 'UiAutomator2',
      'appium:browserName': 'Chrome',
      'appium:options': {
        // openIMIS demo URL
        chromeOptions: {
          args: ['--no-sandbox', '--disable-dev-shm-usage'],
        },
        // The ChromeDriver session needs an initial URL
        appActivity: 'com.google.android.apps.chrome.Main',
        // Wipe state between runs
        fullReset: true,
        newCommandTimeout: 120,
      },
    } as any,
  ],
};
