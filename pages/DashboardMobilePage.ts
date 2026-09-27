import { browser, $ } from '@wdio/globals';
import { BaseMobilePage } from './BaseMobilePage';

/**
 * DashboardMobilePage — post-login landing on a mobile browser.
 *
 * On demo.openimis.org the dashboard shows:
 *   - Welcome heading ("Welcome Admin Admin!")
 *   - A row of app-bar dropdown buttons: "Insurees and Policies",
 *     "Claims", "Administration", "Tools", "Profile", etc.
 *   - The "Session Expired" modal that pops up frequently
 *
 * On a mobile viewport the app-bar dropdowns replace the desktop
 * hamburger menu — same flow, different selector.
 */
export class DashboardMobilePage extends BaseMobilePage {
  get greetingHeading() {
    return $('h1, h2, h3, .MuiTypography-h4, .MuiTypography-h5').getElement();
  }
  get appBar() {
    return $('header.MuiAppBar-root').getElement();
  }
  // Top-level app-bar dropdown triggers
  get insureesAndPoliciesMenu() {
    return $('header button:has-text("Insurees and Policies")').getElement();
  }
  get claimsMenu() {
    return $('header button:has-text("Claims")').getElement();
  }
  get administrationMenu() {
    return $('header button:has-text("Administration")').getElement();
  }
  get toolsMenu() {
    return $('header button:has-text("Tools")').getElement();
  }
  get profileMenu() {
    return $('header button:has-text("Profile")').getElement();
  }

  async open(): Promise<void> {
    await this.goto('/home');
    await this.waitForAppIdle();
  }

  async getGreeting(): Promise<string> {
    return ((await (await this.greetingHeading).getText()) ?? '').trim();
  }

  /**
   * Open the app-bar dropdown and tap the target item. Mirrors the
   * desktop `navigateViaMenu` but uses touch-friendly `click()`.
   */
  async navigateViaMenu(menuLabel: string, itemLabel: string): Promise<void> {
    const trigger = await this[`${this.camelize(menuLabel)}Menu`];
    if (!trigger) throw new Error(`Menu trigger "${menuLabel}" not found`);
    await trigger.click();
    await this.waitForAppIdle(1_500);
    const item = await $(`a:has-text("${itemLabel}"), [role="menuitem"]:has-text("${itemLabel}")`);
    await item.click();
    await this.waitForAppIdle();
    await this.dismissDialog();
  }

  /** Helper: capitalize + remove spaces ("Insurees and Policies"). */
  private camelize(label: string): string {
    return label
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .split(/\s+/)
      .map((w, i) => (i === 0 ? w[0].toLowerCase() + w.slice(1) : w))
      .join('');
  }

  /** Mobile-friendly URL helper. */
  async getPathname(): Promise<string> {
    const url = await browser.getUrl();
    try {
      return new URL(url).pathname;
    } catch {
      return url;
    }
  }

  private async dismissDialog(): Promise<void> {
    await this.dismissBlockingDialogs();
  }
}
