/**
 * Touch-aware mobile helpers — wrap WebdriverIO gesture commands in
 * semantic names so tests read like behaviour, not gesture commands.
 */
import { browser, $ } from '@wdio/globals';

export class MobileActions {
  /** Swipe up on the whole screen (scroll down to see more content). */
  static async swipeUp(times = 1): Promise<void> {
    const { width, height } = await browser.getWindowSize();
    for (let i = 0; i < times; i++) {
      await browser.swipe({
        from: { x: width / 2, y: height * 0.8 },
        to: { x: width / 2, y: height * 0.2 },
        duration: 300,
      });
    }
  }

  /** Swipe down (scroll up). */
  static async swipeDown(times = 1): Promise<void> {
    const { width, height } = await browser.getWindowSize();
    for (let i = 0; i < times; i++) {
      await browser.swipe({
        from: { x: width / 2, y: height * 0.2 },
        to: { x: width / 2, y: height * 0.8 },
        duration: 300,
      });
    }
  }

  /** Tap an element by its visible text (mobile-friendly). */
  static async tapByText(text: string | RegExp): Promise<void> {
    const sel = typeof text === 'string' ? `*=${text}` : /.*/.source;
    const el = await $(`android=new UiSelector().textMatches("${sel}")`).catch(() => null)
      ?? await $(`*=${typeof text === 'string' ? text : ''}`);
    await el?.click();
  }

  /** Hide the soft keyboard (iOS / Android). */
  static async hideKeyboard(): Promise<void> {
    if (browser.isIOS) {
      await browser.execute('mobile: tap', { x: 1, y: 1 }).catch(() => undefined);
    } else {
      await browser.pressKeyCode(4).catch(() => undefined); // Android BACK
    }
  }

  /** Open the URL bar / app switcher. */
  static async openAppSwitcher(): Promise<void> {
    if (browser.isIOS) {
      await browser.execute('mobile: swipe', { direction: 'up' }).catch(() => undefined);
    } else {
      await browser.pressKeyCode(187).catch(() => undefined); // Android RECENTS
    }
  }

  /** Take a mobile screenshot annotated with the device name. */
  static async screenshot(label: string): Promise<void> {
    await browser.saveScreenshot(`./reports/screenshots/mobile-${label}.png`);
  }
}
