/**
 * Device configuration for both target platforms.
 * Centralised here so tests and config files reference one source.
 */
export const DeviceConfig = {
  iphone17: {
    name: 'iPhone 17',
    platform: 'iOS',
    platformVersion: '18.0',
    automationName: 'XCUITest',
    browserName: 'Safari',
    viewport: { width: 393, height: 852 },
    pixelRatio: 3,
  },
  galaxyS25: {
    name: 'Samsung Galaxy S25',
    platform: 'Android',
    platformVersion: '15',
    automationName: 'UiAutomator2',
    browserName: 'Chrome',
    viewport: { width: 412, height: 915 },
    pixelRatio: 3,
  },
} as const;

export type DeviceKey = keyof typeof DeviceConfig;
