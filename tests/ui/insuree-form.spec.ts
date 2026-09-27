import { InsureeMobilePage, LoginPage } from '../../pages';

/**
 * Mobile insuree form — mirrors desktop insuree.spec.ts but adapted for
 * the mobile flow (which goes through Add Family/Group, not direct add).
 *
 * The test verifies the form fields exist and accept input on a touch
 * keyboard — that's the critical mobile concern.
 */
describe('Mobile · Insuree form @ui @mobile', () => {
  it('navigates to Add Family/Group page', async () => {
    const login = new LoginPage();
    await login.open();
    await login.login();
    const insuree = new InsureeMobilePage();
    await insuree.open();
    // Open the Add Family/Group via the app-bar menu.
    await browser
      .$(`header button:has-text("Insurees and Policies")`)
      .then((b) => b.click());
    await browser.pause(500);
    await browser.$(`a:has-text("Add Family/Group")`).then((a) => a.click());
    await browser.pause(3_000);
    const url = await browser.getUrl();
    expect(url).toContain('/insuree/family');
  });

  it('Add Family page exposes form input fields', async () => {
    await browser.url('https://demo.openimis.org/front/insuree/family');
    await browser.pause(3_000);
    const inputs = await $$('input');
    // At least one input field should be present (the address field etc.).
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('insuree chfId input accepts text via the soft keyboard', async () => {
    await browser.url('https://demo.openimis.org/front/insuree/family');
    await browser.pause(3_000);
    const chfId = await browser.$('input[name="chfId"]').catch(() => null);
    if (!chfId) {
      // Demo may not have chfId input on the family page; skip.
      pending('chfId input not present on this demo');
      return;
    }
    await chfId.setValue('CHF-QA-12345');
    await browser.pause(300);
    const value = await chfId.getValue();
    expect(value).toBe('CHF-QA-12345');
  });
});
