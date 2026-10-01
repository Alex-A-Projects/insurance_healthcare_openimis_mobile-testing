# openIMIS Mobile Test Suite

A mobile end-to-end automation framework for [openIMIS](https://openimis.org/) — the open-source insurance and healthcare management information system.

Targets **iPhone 17 (iOS 18, Safari / XCUITest)** and **Samsung Galaxy S25 (Android 15, Chrome / UiAutomator2)** via [WebdriverIO](https://webdriver.io/) + [Appium](http://appium.io/).

The framework is intentionally single-stack — there is **no Playwright, no
Selenium, and no separate web-driver layer**. Everything goes through
Appium's XCUITest and UiAutomator2 drivers, with WebdriverIO as the test
runner.

> This is a **portfolio piece** — the test files are written and ready to run the moment a Mac with Xcode (for iOS) and/or Android Studio (for Android) is available, but the project itself does NOT install those tools.

## Quick start

```bash
npm install

# Run on iOS simulator (requires Xcode + an iPhone 17 simulator + Appium)
npm run test:ios

# Run on Android emulator (requires Android Studio + Galaxy S25 AVD + Appium)
npm run test:android

# One specific suite
npm run test:login
npm run test:insuree
```

Appium needs to be running separately:

```bash
npm install -g appium
appium --address 127.0.0.1 --port 4723
```

## Project Layout

```
.
├── pages/                          # Page Object Model
│   ├── BaseMobilePage.ts            #   - shared helpers (tap, swipe, waitForIdle)
│   ├── LoginPage.ts                 #   - mobile login form
│   ├── DashboardMobilePage.ts       #   - post-login app-bar navigation
│   └── InsureeMobilePage.ts         #   - insuree searcher
├── utils/
│   ├── helpers.ts                   #   - (placeholder)
│   ├── testData.ts                  #   - demo creds, device config
│   └── mobileActions.ts             #   - touch gesture helpers
├── tests/
│   └── ui/                          #   - mobile test specs
│       ├── login.spec.ts            #   - login form + flow
│       ├── navigation.spec.ts       #   - app-bar navigation
│       ├── dashboard.spec.ts        #   - dashboard landing
│       ├── insuree.spec.ts          #   - insuree searcher
│       ├── insuree-form.spec.ts     #   - Add Family form
│       ├── profile.spec.ts          #   - profile pages
│       ├── tools.spec.ts            #   - tools menu links
│       └── accessibility.spec.ts    #   - mobile a11y checks
├── appium/
│   ├── ios.ts                       #   - iOS capabilities
│   └── android.ts                   #   - Android capabilities
├── wdio.shared.conf.ts              #   - main WDIO + Appium config
├── docs/PORTFOLIO.md                #   - portfolio walkthrough
└── package.json
```

## Test scenarios (mirror desktop suite)

| Mobile spec | Mirrors desktop | Mobile-specific concerns |
| --- | --- | --- |
| `login.spec.ts` | `tests/ui/login.spec.ts` | soft keyboard, mobile viewport |
| `navigation.spec.ts` | `tests/ui/navigation.spec.ts` | app-bar dropdowns (mobile replaces hamburger) |
| `dashboard.spec.ts` | `tests/ui/dashboard.spec.ts` | viewport-conditional layouts |
| `insuree.spec.ts` | `tests/ui/insuree.spec.ts` | DataGrid → stacked cards at narrow widths |
| `insuree-form.spec.ts` | `tests/ui/insuree.spec.ts` | touch-keyboard interaction |
| `profile.spec.ts` | `tests/ui/profile.spec.ts` | viewport rendering |
| `tools.spec.ts` | `tests/ui/tools.spec.ts` | dropdown tap latency |
| `accessibility.spec.ts` | `tests/ui/accessibility.spec.ts` | touch target sizes, viewport meta, screen reader |

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `APPIUM_HOST` | `127.0.0.1` | Where Appium listens |
| `APPIUM_PORT` | `4723` | Appium port |
| `OPENIMIS_BASE_URL` | `https://demo.openimis.org` | Demo SPA base |
| `OPENIMIS_USERNAME` | `Admin` | Demo creds |
| `OPENIMIS_PASSWORD` | `admin123` | Demo creds |

## Devices

| Device | OS | Driver | Browser |
| --- | --- | --- | --- |
| iPhone 17 | iOS 18 | XCUITest | Safari |
| Samsung Galaxy S25 | Android 15 | UiAutomator2 | Chrome |

Capabilities are defined in `appium/ios.ts` and `appium/android.ts`.

## Setup checklist (runbook)

1. **Install Node 18+** and `npm install` the project.
2. **Appium 2.x**: `npm install -g appium`
3. **Drivers** (one-time):
   - `appium driver install xcuitest` (iOS)
   - `appium driver install uiautomator2` (Android)
4. **Xcode 15+** with iOS 18 simulator runtime (macOS only).
5. **Android Studio** with API 35 platform + a Galaxy S25 AVD.
6. **Start Appium**: `appium --address 127.0.0.1 --port 4723`
7. **Run**: `npm run test:ios` or `npm run test:android`

See [docs/PORTFOLIO.md](docs/PORTFOLIO.md) for a deeper walkthrough of the framework design and what each piece demonstrates.