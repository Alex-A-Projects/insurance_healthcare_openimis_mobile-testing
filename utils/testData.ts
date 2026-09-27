/**
 * Mobile-suite test data. Mirrors the desktop suite's testData.ts.
 */
export const DemoCredentials = {
  username: process.env.OPENIMIS_USERNAME ?? 'Admin',
  password: process.env.OPENIMIS_PASSWORD ?? 'admin123',
} as const;

export const TargetDevices = {
  iphone: {
    name: 'iPhone 17',
    os: 'iOS 18',
    viewport: { width: 393, height: 852 }, // iPhone 17 logical points
  },
  samsung: {
    name: 'Samsung Galaxy S25',
    os: 'Android 15',
    viewport: { width: 412, height: 915 }, // S25 logical pixels
  },
} as const;

/** Default openIMIS demo base — the mobile browser navigates here. */
export const DemoBaseUrl = 'https://demo.openimis.org';
