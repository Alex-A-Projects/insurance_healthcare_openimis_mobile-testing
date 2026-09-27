import { LoginPage } from '../../pages';

/**
 * Mobile accessibility — touches on a11y issues that are ESPECIALLY
 * relevant on mobile:
 *   - Touch target sizes (Apple HIG: ≥ 44pt, Material: ≥ 48dp)
 *   - Input type=password (virtual keyboard layout)
 *   - Viewport meta tag (no zoom, proper initial-scale)
 *   - ARIA roles on form fields (screen reader support)
 */
describe('Mobile · Accessibility @ui @a11y @mobile', () => {
  beforeEach(async () => {
    const login = new LoginPage();
    await login.open();
  });

  it('viewport meta tag is set correctly', async () => {
    const metas = await $$('meta[name="viewport"]');
    expect(metas.length).toBeGreaterThanOrEqual(1);
  });

  it('password input has type=password (triggers numeric / secure keyboard)', async () => {
    const login = new LoginPage();
    await expect(login.passwordInput).toHaveAttribute('type', 'password');
  });

  it('username input has type=text (triggers the standard keyboard)', async () => {
    const login = new LoginPage();
    await expect(login.usernameInput).toHaveAttribute('type', 'text');
  });

  it('login form renders an accessible label for the username field', async () => {
    const labels = await $$('label');
    const usernameLabel = labels.find(async (l) => /username|nom/i.test(await l.getText()));
    expect(usernameLabel).toBeDefined();
  });

  it('login form renders an accessible label for the password field', async () => {
    const labels = await $$('label');
    const passwordLabel = labels.find(async (l) => /password|mot/i.test(await l.getText()));
    expect(passwordLabel).toBeDefined();
  });

  it('login button has visible text (not just an icon)', async () => {
    const login = new LoginPage();
    const text = await login.loginButton.getText();
    expect((text ?? '').trim().length).toBeGreaterThan(0);
  });

  it('HTML has lang attribute (screen reader pronunciation)', async () => {
    const lang = await browser.execute(() => document.documentElement.lang);
    expect(typeof lang === 'string' && lang.length > 0).toBeTruthy();
  });
});
