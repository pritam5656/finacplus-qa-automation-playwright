const { expect } = require('@playwright/test');
const { BasePage } = require('../core/BasePage');
const { AuthHeader } = require('../components/AuthHeader');
const { logger } = require('../utils/logger');
const { timeouts } = require('../constants/timeouts');

class BookStorePage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   * @param {import('../core/OverlayHandler').OverlayHandler} [overlayHandler]
   * @param {AuthHeader} [authHeader]
   */
  constructor(page, overlayHandler, authHeader = new AuthHeader(page)) {
    super(page, overlayHandler);
    this.authHeader = authHeader;
    this.searchBox = page.locator('#searchBox');
    this.bookRows = page.getByRole('row');
  }

  get path() {
    return '/books';
  }

  async openDirect() {
    await this.goto(this.path);
    await this.searchBox.waitFor({ state: 'visible' });
  }

  async search(searchTerm) {
    logger.info(`Searching for "${searchTerm}"`);
    await this.searchBox.fill(searchTerm);
    await this.page
      .getByRole('link', { name: searchTerm })
      .first()
      .waitFor({ state: 'visible', timeout: timeouts.medium });
  }

  rowForTitle(title) {
    return this.bookRows
      .filter({ has: this.page.getByRole('link', { name: title }) })
      .first();
  }

  async expectBookInResults(expectedTitle) {
    logger.info(`Expecting book in results: ${expectedTitle}`);
    await expect(
      this.page.getByRole('link', { name: expectedTitle }).first(),
      `Book link "${expectedTitle}" should be visible in search results`,
    ).toBeVisible();
    await expect(
      this.rowForTitle(expectedTitle),
      `Book row for "${expectedTitle}" should be visible`,
    ).toBeVisible();
  }

  /** Columns: Image | Title | Author | Publisher */
  async getBookDetails(title) {
    const row = this.rowForTitle(title);
    await expect(row, `Row for "${title}" must be visible to read details`).toBeVisible();

    const cells = row.getByRole('cell');
    const details = {
      title: (await cells.nth(1).innerText()).trim(),
      author: (await cells.nth(2).innerText()).trim(),
      publisher: (await cells.nth(3).innerText()).trim(),
    };

    logger.info('Book details', details);

    if (!details.title || !details.author || !details.publisher) {
      throw new Error(`Could not read full book details: ${JSON.stringify(details)}`);
    }

    return details;
  }

  async logout() {
    await this.dismissBlockingOverlays();
    await this.authHeader.logout();
  }
}

module.exports = { BookStorePage };
