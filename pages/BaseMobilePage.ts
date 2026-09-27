import { browser } from '@wdio/globals';

/**
 * BaseMobilePage - shared behaviour for every Page Object in the mobile
 * openIMIS suite.
 *
 * The mobile openIMIS frontend is the SAME React/Material UI SPA that
 * the desktop suite tests — just rendered through Safari/Chrome on a
 * touch device. So locators largely mirror the desktop equivalents
 * (`input[name="chfId"]`, `button:has-text("Log In")`, …), but actions
 * use touch-aware helpers (tap, swipe, scrollIntoView).
 */
export class BaseMobilePage {
  /** Mobile viewport helpers. */
  readonly helpers: ReturnType<typeof browser.getHelpers>;

  constructor() {
    this.helpers = browser.getHelpers ? browser.getHelpers() : ({} as any);
  }

  /** Wait until any visible loading spinner / MUI progress indicator disappears. */
  async waitForAppIdle(timeoutMs = 15_000): Promise<void> {
    await browser.waitUntil(
      async () => {
        const spinners = await browser.$$('.MuiCircularProgress-root, .MuiDataGrid-loadingOverlay, .MuiBackdrop-root');
        for (const s of spinners) {
          if (await s.isDisplayed().catch(() => false)) return false;
        }
        return true;
      },
      { timeout: timeoutMs, timeoutMsg: 'App did not become idle in time' },
    );
  }

  /** Tap an element by its visible text. */
  async tapByText(text: string | RegExp): Promise<void> {
    const el = await browser.$(`android=new UiSelector().textContains("${text}")`).catch(() => null)
      ?? await browser.$(`//*[contains(@label, "${typeof text === 'string' ? text : ''}")]`)
      ?? await browser.$(`button:has-text("${text}")`);
    await el?.click();
  }

  /** Tap an element by its `name=` attribute. The most reliable openIMIS selector. */
  async tapByName(name: string): Promise<void> {
    const el = await browser.$(`input[name="${name}"], select[name="${name}"], textarea[name="${name}"]`);
    await el.waitForClickable({ timeout: 10_000 });
    await el.click();
  }

  /** Fill an input by its `name=` attribute. */
  async fillByName(name: string, value: string): Promise<void> {
    const el = await browser.$(`input[name="${name}"], textarea[name="${name}"]`);
    await el.waitForDisplayed({ timeout: 10_000 });
    await el.clearValue();
    await el.setValue(value);
  }

  /** Scroll a deep element into view via the standard touch scroll. */
  async scrollIntoView(selector: string): Promise<void> {
    const el = await browser.$(selector);
    await el.scrollIntoView();
  }

  /** Take a screenshot for the report. */
  async screenshot(name: string): Promise<void> {
    await browser.saveScreenshot(`./reports/screenshots/${name}.png`);
  }

  /** Dismiss any visible MUI Dialog (Ok/Cancel/Close). */
  async dismissDialog(buttonText = 'Ok'): Promise<void> {
    const dialog = await browser.$('[role="dialog"]:visible');
    if (!(await dialog.isDisplayed().catch(() => false))) return;
    const btn = await dialog.$(`button:has-text("${buttonText}")`);
    if (await btn.isDisplayed().catch(() => false)) {
      await btn.click();
      await this.waitForAppIdle(5_000);
    }
  }

  /** Get the current page URL (mobile browser address bar). */
  async getUrl(): Promise<string> {
    return await browser.getUrl();
  }

  /** Navigate to a relative path under the SPA base. */
  async goto(path: string): Promise<void> {
    const base = process.env.OPENIMIS_BASE_URL ?? 'https://demo.openimis.org';
    const url = path.startsWith('http') ? path : `${base.replace(/\/$/, '')}/front${path.startsWith('/') ? path : '/' + path}`;
    await browser.url(url);
    await this.waitForAppIdle();
    await this.dismissDialog();
  }
}
