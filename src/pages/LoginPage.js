const { BasePage } = require('../core/BasePage');
const { BookStoreSidebar } = require('../components/BookStoreSidebar');
const { logger } = require('../utils/logger');

class LoginPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   * @param {import('../core/OverlayHandler').OverlayHandler} [overlayHandler]
   * @param {BookStoreSidebar} [sidebar]
   */
  constructor(page, overlayHandler, sidebar = new BookStoreSidebar(page)) {
    super(page, overlayHandler);
    this.sidebar = sidebar;
    this.userNameInput = page.locator('#userName');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login');
  }

  get path() {
    return '/login';
  }

  async openFromSidebar() {
    await this.dismissBlockingOverlays();
    await this.sidebar.openLogin();
    await this.waitForUrlContains('/login');
    await this.userNameInput.waitFor({ state: 'visible' });
  }

  async openDirect() {
    await this.goto(this.path);
    await this.userNameInput.waitFor({ state: 'visible' });
  }

  async login(username, password) {
    logger.info(`Logging in as ${username}`);
    await this.userNameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.dismissBlockingOverlays();
    await this.loginButton.click();
  }

  async expectLoginFormVisible() {
    await this.userNameInput.waitFor({ state: 'visible' });
    await this.loginButton.waitFor({ state: 'visible' });
  }
}

module.exports = { LoginPage };
