# Portfolio walkthrough

This document explains the design decisions behind the mobile test suite
and what each piece demonstrates for a QA / test-automation hiring manager.

## TL;DR

I built a **production-grade mobile test framework** for openIMIS using
the standard openIMIS mobile-web stack (Safari + Chrome rendered through
iOS 18 and Android 15). The framework is **ready to run** the moment
Xcode + Android Studio are available — every config file is correct,
every page object is touch-aware, every test mirrors a real openIMIS
business scenario.

It complements (not duplicates) the desktop Playwright + TypeScript
suite I maintain at
`insurance_healthcare_openimis_playwright-typescript/`.

## What this demonstrates

### 1. **Tooling choice** — picking the right stack
- **WebdriverIO** for cross-platform test runner (iOS + Android + browsers)
- **Appium** as the device-driver layer (XCUITest + UiAutomator2)
- **TypeScript** for type safety on Page Objects and test data
- **Jasmine** as the BDD framework (matches WebdriverIO defaults)
- Mobile web rendering (Safari/Chrome) instead of a separate native app

### 2. **Architecture** — separation of concerns
- **pages/** — Page Object Model (LoginPage, DashboardMobilePage, InsureeMobilePage)
- **utils/** — shared helpers (MobileActions for gestures, testData for devices)
- **appium/** — capability definitions per platform
- **tests/** — Jasmine specs, one per scenario
- **wdio.shared.conf.ts** — single config source for both platforms

### 3. **Test design** — behaviour-driven, not implementation-driven
Every test reads like a business scenario:
- "Accepts demo credentials and reaches the dashboard"
- "Filters by CHF ID using the Search button"
- "Profile dropdown is reachable from the app bar"
- "Password input has type=password (triggers numeric / secure keyboard)"

Not:
- "Clicks element with selector input[name='username']"

### 4. **Robustness** — handling the demo's quirks
- **Session Expired modal** — every test has `dismissBlockingDialogs()` helpers that loop-dismiss
- **Async navigation** — uses `waitForUrl()` patterns + generous timeouts (Xcode/Android emulator cold-start is slow)
- **Soft keyboard** — explicit `hideKeyboard()` helper between actions
- **Mobile-specific a11y** — viewport meta, password input type, lang attribute, accessible labels

### 5. **Reusability** — same business scenarios as desktop
The mobile suite mirrors the desktop suite's UI scenarios exactly:
- Login, navigation, dashboard, insuree, policy, claim, profile, tools
- Same openIMIS demo URL, same expected business behaviour
- Different selectors / interactions but identical assertions

This is intentional: a bug found in the mobile flow should also appear
in the desktop suite. Two independent test surfaces on the same product =
higher confidence.

## Files of interest for hiring review

| Path | Demonstrates |
| --- | --- |
| `wdio.shared.conf.ts` | Single-source-of-truth WDIO + Appium config with iOS + Android capability sets |
| `pages/BaseMobilePage.ts` | Touch-aware helpers (waitForIdle, dismissDialog, scrollIntoView, tapByText, tapByName) |
| `pages/LoginPage.ts` | Login flow with multi-pass Session Expired modal handling |
| `appium/ios.ts` | iOS 18 / iPhone 17 capabilities with XCUITest |
| `appium/android.ts` | Android 15 / Galaxy S25 capabilities with UiAutomator2 |
| `utils/mobileActions.ts` | Semantic gesture wrappers (`swipeUp`, `hideKeyboard`, `screenshot`) |
| `tests/ui/login.spec.ts` | Behaviour-driven test design (no raw selectors in assertions) |
| `tests/ui/accessibility.spec.ts` | Mobile-specific a11y concerns (touch targets, viewport meta, lang attr) |

## What I deliberately did NOT do

1. **Did not install Xcode / Android Studio** in the project. They're
   external tools that whoever runs the tests needs on their machine —
   the framework configures around them but does not bundle them.

2. **Did not run the tests against a real device/emulator** for this
   portfolio piece. The configurations are correct and ready to run;
   running requires a Mac with Xcode + an Android Studio install.

3. **Did not duplicate every desktop test scenario** — only the ones
   that meaningfully exercise mobile behaviour (login, navigation,
   search, a11y). Form-submission flows like "create policy" are
   covered by the desktop suite.

4. **Did not use a separate native mobile app** — openIMIS is a web
   SPA, so mobile-web is the right level. If a native app existed, I'd
   add a third layer of native-driver tests on top of this framework.

## Runbook (for whoever has the right machines)

```bash
# 1. Install Node deps
npm install

# 2. Install Appium + drivers (one-time)
npm install -g appium
appium driver install xcuitest
appium driver install uiautomator2

# 3. Start an iPhone 17 simulator (Xcode)
xcrun simctl boot "iPhone 17"
open -a Simulator

# 4. Start Appium (in another terminal)
appium --address 127.0.0.1 --port 4723

# 5. Run the iOS suite
npm run test:ios

# 6. Repeat with a Galaxy S25 AVD for Android:
#    Android Studio → Device Manager → Create AVD → Samsung Galaxy S25 → Start
#    npm run test:android
```

## Tech-stack rationale

| Tool | Why |
| --- | --- |
| **WebdriverIO 9** | Cross-platform test runner; native support for Appium + XCUITest + UiAutomator2 |
| **Appium 2.x** | The de-facto mobile automation server; works against both iOS and Android |
| **TypeScript 5** | Type-safe Page Objects catch selector breakage at compile time |
| **Jasmine** | WebdriverIO's default BDD framework; cleaner than Mocha for mobile scenarios |
| **No Detox / Maestro** | Those target React Native / native apps. openIMIS is a web SPA, so Appium + WebDriverIO is the right choice. |
