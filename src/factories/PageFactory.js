const { OverlayHandler } = require('../core/OverlayHandler');
const { HomePage, LoginPage, ProfilePage, BookStorePage } = require('../pages');
const { BookStoreSidebar } = require('../components/BookStoreSidebar');
const { AuthHeader } = require('../components/AuthHeader');

/**
 * Constructs page objects and shared UI collaborators.
 * Fixtures use this instead of instantiating pages directly.
 */
class PageFactory {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.overlays = new OverlayHandler(page);
    this.sidebar = new BookStoreSidebar(page);
    this.authHeader = new AuthHeader(page);
  }

  home() {
    return new HomePage(this.page, this.overlays);
  }

  login() {
    return new LoginPage(this.page, this.overlays, this.sidebar);
  }

  profile() {
    return new ProfilePage(this.page, this.overlays, this.authHeader);
  }

  bookStore() {
    return new BookStorePage(this.page, this.overlays, this.authHeader);
  }
}

module.exports = { PageFactory };
