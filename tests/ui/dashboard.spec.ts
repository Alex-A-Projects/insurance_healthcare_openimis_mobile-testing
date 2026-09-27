import { DashboardMobilePage, LoginPage } from '../../pages';

/**
 * Mobile dashboard — mirrors desktop dashboard.spec.ts.
 */
describe('Mobile · Dashboard @ui @mobile', () => {
  beforeEach(async () => {
    const login = new LoginPage();
    await login.open();
    await login.login();
  });

  it('shows a welcome heading', async () => {
    const dashboard = new DashboardMobilePage();
    const greeting = await dashboard.getGreeting();
    expect(greeting.length).toBeGreaterThan(0);
  });

  it('app bar dropdowns are present after login', async () => {
    const dashboard = new DashboardMobilePage();
    await expect(dashboard.insureesAndPoliciesMenu).toBeDisplayed();
    await expect(dashboard.claimsMenu).toBeDisplayed();
    await expect(dashboard.toolsMenu).toBeDisplayed();
  });

  it('URL is /front/home after login', async () => {
    const dashboard = new DashboardMobilePage();
    const path = await dashboard.getPathname();
    expect(path).toContain('/home');
  });
});
