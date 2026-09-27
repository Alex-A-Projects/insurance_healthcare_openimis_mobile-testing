import { DashboardMobilePage, InsureeMobilePage, LoginPage } from '../../pages';

/**
 * Mobile navigation — mirrors desktop navigation.spec.ts. The app-bar
 * dropdown menus work the same way on touch as on desktop.
 */
describe('Mobile · Navigation @ui @mobile', () => {
  beforeEach(async () => {
    const login = new LoginPage();
    await login.open();
    await login.login();
  });

  it('lands on /front/home after login', async () => {
    const dashboard = new DashboardMobilePage();
    const path = await dashboard.getPathname();
    expect(path).toContain('/home');
  });

  it('app bar is visible on a mobile viewport', async () => {
    const dashboard = new DashboardMobilePage();
    await expect(dashboard.appBar).toBeDisplayed();
  });

  it('Insurees and Policies dropdown is reachable from the app bar', async () => {
    const dashboard = new DashboardMobilePage();
    await expect(dashboard.insureesAndPoliciesMenu).toBeDisplayed();
  });

  it('Claims dropdown is reachable from the app bar', async () => {
    const dashboard = new DashboardMobilePage();
    await expect(dashboard.claimsMenu).toBeDisplayed();
  });

  it('Tools dropdown is reachable from the app bar', async () => {
    const dashboard = new DashboardMobilePage();
    await expect(dashboard.toolsMenu).toBeDisplayed();
  });

  it('Profile dropdown is reachable from the app bar', async () => {
    const dashboard = new DashboardMobilePage();
    await expect(dashboard.profileMenu).toBeDisplayed();
  });

  it('navigates to the Insurees searcher via the app bar', async () => {
    const dashboard = new DashboardMobilePage();
    await dashboard.navigateViaMenu('Insurees and Policies', 'Insurees');
    const path = await dashboard.getPathname();
    expect(path).toContain('/insuree/insurees');
  });
});
