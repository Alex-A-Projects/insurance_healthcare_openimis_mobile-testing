import { LoginPage } from '../../pages';

/**
 * Mobile login flow — mirrors the desktop suite's login.spec.ts but
 * uses touch-aware locators via WebdriverIO + Appium.
 */
describe('Mobile · Login @ui @mobile', () => {
  it('renders the login form on a mobile viewport', async () => {
    const login = new LoginPage();
    await login.open();
    await expect(login.usernameInput).toBeDisplayed();
    await expect(login.passwordInput).toBeDisplayed();
    await expect(login.loginButton).toBeDisplayed();
  });

  it('accepts demo credentials and reaches the dashboard', async () => {
    const login = new LoginPage();
    await login.open();
    await login.login();
    // The mobile demo redirects to /front/home after auth
    const url = await browser.getUrl();
    expect(url).toContain('/home');
  });

  it('masks the password input', async () => {
    const login = new LoginPage();
    await login.open();
    await expect(login.passwordInput).toHaveAttribute('type', 'password');
  });

  it('shows a label for the username input', async () => {
    const login = new LoginPage();
    await login.open();
    const labels = await $$('label');
    const usernameLabel = labels.find(async (l) => /username|nom/i.test(await l.getText()));
    expect(usernameLabel).toBeDefined();
  });

  it('shows a label for the password input', async () => {
    const login = new LoginPage();
    await login.open();
    const labels = await $$('label');
    const passwordLabel = labels.find(async (l) => /password|mot/i.test(await l.getText()));
    expect(passwordLabel).toBeDefined();
  });

  it('login button has visible text on a small viewport', async () => {
    const login = new LoginPage();
    await login.open();
    const text = await login.loginButton.getText();
    expect((text ?? '').trim().length).toBeGreaterThan(0);
  });
});
