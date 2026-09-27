import { browser, $ } from '@wdio/globals';
import { BaseMobilePage } from './BaseMobilePage';

/**
 * LoginPage — openIMIS login on a mobile browser.
 *
 * Verified selectors on demo.openimis.org:
 *   - `input[type="text"]`     — username (no name=)
 *   - `input[type="password"]` — password
 *   - `button[type="submit"]:has-text("Log In")`
 *   - `<label>:has-text("Username")` / `Password` (MUI TextField)
 *   - Session Expired modal: `[role="dialog"]` with Ok / Cancel buttons
 */
export class LoginPage extends BaseMobilePage {
  // Form fields (live DOM)
  get usernameInput() {
    return $('input[type="text"]').getElement();
  }
  get passwordInput() {
    return $('input[type="password"]').getElement();
  }
  get loginButton() {
    return $('button[type="submit"]:has-text("Log In"), button:has-text("Log In")').getElement();
  }
  get errorMessage() {
    return $('.MuiAlert-root.MuiAlert-standardError, [role="alert"]').getElement();
  }
  get forgotPasswordButton() {
    return $('button:has-text("Forgot Password")').getElement();
  }
  get okButton() {
    return $('[role="dialog"]:visible button:has-text("Ok")').getElement();
  }
  get cancelButton() {
    return $('[role="dialog"]:visible button:has-text("Cancel")').getElement();
  }

  async open(): Promise<void> {
    await this.goto('/login');
    await this.dismissBlockingDialogs();
  }

  /**
   * Login with the demo credentials (Admin / admin123 by default).
   * Robust against the demo's recurring "Session Expired" modal —
   * we dismiss it in a loop, then dismiss again between fill and click.
   */
  async login(
    username: string = process.env.OPENIMIS_USERNAME ?? 'Admin',
    password: string = process.env.OPENIMIS_PASSWORD ?? 'admin123',
  ): Promise<void> {
    await (await this.usernameInput).waitForDisplayed({ timeout: 30_000 });
    await this.dismissBlockingDialogs();

    await (await this.usernameInput).setValue(username);
    await (await this.passwordInput).setValue(password);

    // The modal can reappear between fill() and click() — dismiss in a loop.
    for (let i = 0; i < 3; i++) {
      await this.dismissBlockingDialogs();
      const navP = browser.waitForUrl(
        (url) => !url.pathname.endsWith('/login'),
        { timeout: 10_000 },
      ).catch(() => undefined);
      try {
        await Promise.all([navP, (await this.loginButton).click({ timeout: 5_000 })]);
        break;
      } catch {
        await this.dismissBlockingDialogs();
        continue;
      }
    }
    await this.waitForAppIdle();
  }

  async dismissBlockingDialogs(maxAttempts = 5): Promise<void> {
    for (let i = 0; i < maxAttempts; i++) {
      const dialog = await $('[role="dialog"]:visible').catch(() => null);
      if (!dialog || !(await dialog.isDisplayed().catch(() => false))) return;
      const ok = await dialog.$('button:has-text("Ok"), button:has-text("OK")');
      if (ok && (await ok.isDisplayed().catch(() => false))) {
        await ok.click().catch(() => undefined);
      } else {
        await browser.keys(['Escape']).catch(() => undefined);
      }
      await this.waitForAppIdle(3_000);
    }
  }

  async getErrorMessage(): Promise<string> {
    const err = await this.errorMessage;
    if (!(await err.isDisplayed({ timeout: 1_000 }).catch(() => false))) return '';
    return (await err.getText())?.trim() ?? '';
  }
}
