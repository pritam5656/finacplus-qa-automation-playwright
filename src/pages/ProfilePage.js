const { BasePage } = require('../core/BasePage');
const { AuthHeader } = require('../components/AuthHeader');
const { logger } = require('../utils/logger');
const { timeouts } = require('../constants/timeouts');

class ProfilePage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   * @param {import('../core/OverlayHandler').OverlayHandler} [overlayHandler]
   * @param {AuthHeader} [authHeader]
   */
  constructor(page, overlayHandler, authHeader = new AuthHeader(page)) {
    super(page, overlayHandler);
    this.authHeader = authHeader;
    this.gotoBookStoreButton = page
      .locator('#gotoStore')
      .or(page.getByRole('button', { name: 'Go To Book Store' }));
  }

  get path() {
    return '/profile';
  }

  async expectLoggedInAs(username) {
    await this.waitForUrlContains('/profile');
    await this.authHeader.expectLoggedInAs(username, { timeout: timeouts.long });
  }

  async goToBookStore() {
    logger.info('Navigating to Book Store from profile');
    await this.dismissBlockingOverlays();
    await this.gotoBookStoreButton.scrollIntoViewIfNeeded();
    await this.gotoBookStoreButton.click();
    await this.waitForUrlContains('/books');
  }

  async logout() {
    await this.dismissBlockingOverlays();
    await this.authHeader.logout();
  }
}

module.exports = { ProfilePage };
