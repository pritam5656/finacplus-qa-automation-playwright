const { BasePage } = require('../core/BasePage');
const { logger } = require('../utils/logger');

class HomePage extends BasePage {
  constructor(page, overlayHandler) {
    super(page, overlayHandler);
    this.bookStoreCard = page.locator('.card').filter({ hasText: 'Book Store Application' });
  }

  get path() {
    return '/';
  }

  async open() {
    await this.goto(this.path);
    await this.bookStoreCard.first().waitFor({ state: 'visible' });
  }

  async goToBookStoreApplication() {
    logger.info('Opening Book Store Application');
    await this.dismissBlockingOverlays();
    await this.bookStoreCard.first().scrollIntoViewIfNeeded();
    await this.bookStoreCard.first().click();
    await this.waitForUrlContains('/books');
  }
}

module.exports = { HomePage };
