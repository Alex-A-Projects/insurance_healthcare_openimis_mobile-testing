import { DashboardMobilePage, LoginPage } from '../../pages';

/**
 * Mobile tools menu — exercises the Tools dropdown links.
 */
describe('Mobile · Tools menu @ui @mobile', () => {
  beforeEach(async () => {
    const login = new LoginPage();
    await login.open();
    await login.login();
  });

  it('Tools dropdown opens the reports page', async () => {
    const dashboard = new DashboardMobilePage();
    await dashboard.toolsMenu.click();
    await browser.pause(500);
    await browser.$('a:has-text("Reports")').then((a) => a.click());
    await browser.pause(2_000);
    const url = await browser.getUrl();
    expect(url).toContain('/tools/reports');
  });

  it('Tools dropdown opens the extracts page', async () => {
    const dashboard = new DashboardMobilePage();
    await dashboard.toolsMenu.click();
    await browser.pause(500);
    await browser.$('a:has-text("Extracts")').then((a) => a.click());
    await browser.pause(2_000);
    const url = await browser.getUrl();
    expect(url).toContain('/tools/extracts');
  });

  it('Tools dropdown opens the exports page', async () => {
    const dashboard = new DashboardMobilePage();
    await dashboard.toolsMenu.click();
    await browser.pause(500);
    await browser.$('a:has-text("Exports")').then((a) => a.click());
    await browser.pause(2_000);
    const url = await browser.getUrl();
    expect(url).toContain('/tools/exports');
  });

  it('Tools dropdown opens the registers page', async () => {
    const dashboard = new DashboardMobilePage();
    await dashboard.toolsMenu.click();
    await browser.pause(500);
    await browser.$('a:has-text("Registers")').then((a) => a.click());
    await browser.pause(2_000);
    const url = await browser.getUrl();
    expect(url).toContain('/tools/registers');
  });
});
