/**
 * Android device / emulator capabilities.
 *
 * Targets: Samsung Galaxy S25 (latest) on Android 15 with UiAutomator2.
 *
 * To run against an emulator, launch one via Android Studio's AVD
 * Manager and start the Appium server:
 *
 *   appium --address 127.0.0.1 --port 4723
 *
 * Then from this project:
 *
 *   npm run test:android
 */
export const galaxyS25Capabilities = {
  platformName: 'Android',
  'appium:deviceName': 'Samsung Galaxy S25',
  'appium:platformVersion': '15',
  'appium:automationName': 'UiAutomator2',
  'appium:browserName': 'Chrome',
  'appium:options': {
    // openIMIS demo URL as the initial navigation
    appActivity: 'com.google.android.apps.chrome.Main',
    appPackage: 'com.android.chrome',
    chromeOptions: {
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    },
    // Don't reset between tests — preserve the JWT cookie session
    noReset: true,
    // Wipe ONLY app state, not the whole device
    fullReset: false,
    // The ChromeDriver session needs an initial URL — set via the
    // `appium:options.chromeOptions.args` or via the `appium:options`.
    // The appium-uiautomator2 driver will navigate to the URL on first
    // command if `appium:options.initialUrl` is set.
    initialUrl: 'https://demo.openimis.org/front/login',
    // Generous timeout — Android emulator cold-start can take 60s+
    newCommandTimeout: 180,
    // Don't auto-accept alerts
    autoAcceptAlerts: false,
    // Don't auto-grant runtime permissions — let the demo's permissions
    // prompts trigger so we can dismiss them properly
    autoGrantPermissions: false,
  },
};

/** Older Galaxy models. */
export const galaxyS24Capabilities = {
  ...galaxyS25Capabilities,
  'appium:deviceName': 'Samsung Galaxy S24',
  'appium:platformVersion': '14',
};

export const pixel9Capabilities = {
  ...galaxyS25Capabilities,
  'appium:deviceName': 'Google Pixel 9',
};
