const { logger } = require('../utils/logger');
const { timeouts } = require('../constants/timeouts');
const { OverlayHandler } = require('./OverlayHandler');

/**
 * Shared page object base.
 * Subclasses define `path` and page-specific actions.
 */
class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   * @param {OverlayHandler} [overlayHandler]
   */
  constructor(page, overlayHandler = new OverlayHandler(page)) {
    if (new.target === BasePage) {
      throw new Error('BasePage is abstract and cannot be instantiated directly');
    }
    this.page = page;
    this.overlays = overlayHandler;
  }

  /** @returns {string} Relative path for this page (override in subclasses). */
  get path() {
    throw new Error(`${this.constructor.name} must implement getter path`);
  }

  async goto(path = this.path) {
    logger.info(`Navigating to ${path}`);
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await this.dismissBlockingOverlays();
  }

  async dismissBlockingOverlays() {
    await this.overlays.dismissIfPresent();
  }

  async waitForUrlContains(fragment, timeout = timeouts.urlWait) {
    await this.page.waitForURL((url) => url.href.includes(fragment), { timeout });
  }
}

module.exports = { BasePage };
