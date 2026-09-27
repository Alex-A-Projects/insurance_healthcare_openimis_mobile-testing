import { DashboardMobilePage, LoginPage } from '../../pages';

/**
 * Mobile profile page — mirrors desktop profile.spec.ts.
 */
describe('Mobile · Profile @ui @mobile', () => {
  beforeEach(async () => {
    const login = new LoginPage();
    await login.open();
    await login.login();
  });

  it('Profile dropdown is reachable from the app bar', async () => {
    const dashboard = new DashboardMobilePage();
    await expect(dashboard.profileMenu).toBeDisplayed();
  });

  it('myProfile page loads when navigated to', async () => {
    await browser.url('https://demo.openimis.org/front/profile/myProfile');
    await browser.pause(2_000);
    const url = await browser.getUrl();
    expect(url).toContain('/profile');
  });

  it('changePassword page loads when navigated to', async () => {
    await browser.url('https://demo.openimis.org/front/profile/changePassword');
    await browser.pause(2_000);
    const url = await browser.getUrl();
    expect(url).toContain('/changePassword');
  });
});
