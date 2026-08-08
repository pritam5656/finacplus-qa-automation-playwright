const { expect } = require('@playwright/test');
const { BaseComponent } = require('../core/BaseComponent');
const { logger } = require('../utils/logger');

/**
 * Auth chrome shown after login (username + logout).
 * Composed into ProfilePage / BookStorePage instead of duplicating locators.
 */
class AuthHeader extends BaseComponent {
  constructor(page) {
    super(page);
    this.userNameValue = page.locator('#userName-value');
    // Profile: "Logout"; Book Store: "Log out"
    this.logoutButton = page.getByRole('button', { name: /Log\s*out/i });
  }

  async expectLoggedInAs(username, options = {}) {
    const { timeout } = options;
    logger.info(`AuthHeader: expect user "${username}"`);
    await expect(
      this.userNameValue,
      `Expected username to be "${username}"`,
    ).toHaveText(username, timeout ? { timeout } : undefined);
    await expect(this.logoutButton, 'Logout should be visible when authenticated').toBeVisible();
  }

  async logout() {
    logger.info('AuthHeader: logout');
    await this.logoutButton.click();
  }
}

module.exports = { AuthHeader };
