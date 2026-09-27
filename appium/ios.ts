/**
 * iOS device / simulator capabilities.
 *
 * Targets: iPhone 17 (latest) on iOS 18 with XCUITest driver.
 *
 * To run against a real device or simulator, start the simulator
 * (Xcode → Window → Devices and Simulators) and the Appium server:
 *
 *   appium --address 127.0.0.1 --port 4723
 *
 * Then from this project:
 *
 *   npm run test:ios
 */
export const iPhone17Capabilities = {
  platformName: 'iOS',
  'appium:deviceName': 'iPhone 17',
  'appium:platformVersion': '18.0',
  'appium:automationName': 'XCUITest',
  'appium:browserName': 'Safari',
  'appium:options': {
    bundleId: 'com.apple.mobilesafari',
    safariInitialUrl: 'https://demo.openimis.org/front/login',
    // Use the modern tabbed Safari so cookies persist within a session
    safariAllowPopups: false,
    safariIgnoreFraudWarning: true,
    // Wipe state between runs for clean test isolation
    fullReset: true,
    // Don't auto-accept alerts — the demo's "Session Expired" dialog needs
    // explicit dismissal in some tests
    autoAcceptAlerts: false,
    // Generous timeout — Xcode simulator cold-start can take 30s+
    newCommandTimeout: 180,
    // Use the W3C protocol path consistently
    w3c: true,
  },
};

/** Older iPhone models (kept for portability / regression coverage). */
export const iPhone15Capabilities = {
  ...iPhone17Capabilities,
  'appium:deviceName': 'iPhone 15',
  'appium:platformVersion': '17.5',
};

export const iPadProCapabilities = {
  ...iPhone17Capabilities,
  'appium:deviceName': 'iPad Pro (12.9-inch) (6th generation)',
};
