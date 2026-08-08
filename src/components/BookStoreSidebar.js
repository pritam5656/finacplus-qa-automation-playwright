const { BaseComponent } = require('../core/BaseComponent');
const { logger } = require('../utils/logger');

/**
 * Left-nav for Book Store Application.
 * Shared across Login/Profile/BookStore flows (DRY + SRP).
 */
class BookStoreSidebar extends BaseComponent {
  constructor(page) {
    super(page);
    this.loginItem = page.getByRole('listitem').filter({ hasText: /^Login$/ });
    this.bookStoreItem = page.getByRole('listitem').filter({ hasText: /^Book Store$/ });
    this.profileItem = page.getByRole('listitem').filter({ hasText: /^Profile$/ });
  }

  async openLogin() {
    logger.info('Sidebar → Login');
    await this.loginItem.first().scrollIntoViewIfNeeded();
    await this.loginItem.first().click();
  }

  async openBookStore() {
    logger.info('Sidebar → Book Store');
    await this.bookStoreItem.first().scrollIntoViewIfNeeded();
    await this.bookStoreItem.first().click();
  }

  async openProfile() {
    logger.info('Sidebar → Profile');
    await this.profileItem.first().scrollIntoViewIfNeeded();
    await this.profileItem.first().click();
  }
}

module.exports = { BookStoreSidebar };
