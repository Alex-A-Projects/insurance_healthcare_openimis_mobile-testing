import { browser, $ } from '@wdio/globals';
import { BaseMobilePage } from './BaseMobilePage';

/**
 * InsureeMobilePage — openIMIS insuree searcher on a mobile browser.
 *
 * On mobile, the DataGrid becomes a stacked card list (Material UI's
 * responsive breakpoint collapses the table at <600px). The form fields
 * retain their `name=` attributes, so form interactions work identically.
 */
export class InsureeMobilePage extends BaseMobilePage {
  get addInsureeButton() {
    return $('button:has-text("Add new Insuree"), button:has-text("Add new")').getElement();
  }
  get searchInput() {
    return $('input[placeholder*="nsuree" i]').getElement();
  }
  get searchButton() {
    return super.searchButton;
  }
  get resetFiltersButton() {
    return super.resetFiltersButton;
  }

  // Form fields
  get chfIdInput() {
    return $('input[name="chfId"]').getElement();
  }
  get lastNameInput() {
    return $('input[name="lastName"]').getElement();
  }
  get givenNameInput() {
    return $('input[name="givenName"]').getElement();
  }
  get dobInput() {
    return $('input[name="dob"]').getElement();
  }
  get phoneInput() {
    return $('input[name="phone"]').getElement();
  }
  get emailInput() {
    return $('input[name="email"]').getElement();
  }
  get genderSelect() {
    return $('div:has(> label:has-text("Gender")) [role="combobox"]').getElement();
  }

  /** Open the searcher via the app-bar dropdown. */
  async open(): Promise<void> {
    await browser.url('https://demo.openimis.org/front/insuree/insurees');
    await this.waitForAppIdle();
    await this.dismissBlockingDialogs();
  }

  /** Filter by CHF ID using the search button. */
  async filterByChfId(chfId: string): Promise<void> {
    await (await this.searchInput).setValue(chfId);
    await (await this.searchButton).click();
    await this.waitForAppIdle();
  }

  /** Count rendered rows (works with both DataGrid and stacked cards). */
  async rowCount(): Promise<number> {
    // Try the DataGrid first; fall back to card-style rows
    const gridRows = await browser.$$('.MuiDataGrid-row');
    if (gridRows.length > 0) return gridRows.length;
    const cardRows = await browser.$$('.MuiDataGrid-cell');
    return cardRows.length;
  }
}
