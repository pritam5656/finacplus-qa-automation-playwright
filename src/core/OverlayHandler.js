const { logger } = require('../utils/logger');
const { timeouts } = require('../constants/timeouts');

/**
 * Single responsibility: dismiss DemoQA overlays that block clicks.
 * Injected into pages so BasePage does not own ad-specific logic.
 */
class OverlayHandler {
  constructor(page) {
    this.page = page;
    this.closeAdButton = page.locator('#close-fixedban');
  }

  async dismissIfPresent() {
    try {
      const visible = await this.closeAdButton
        .isVisible({ timeout: timeouts.short })
        .catch(() => false);
      if (visible) {
        logger.info('Dismissing blocking overlay');
        await this.closeAdButton.click({ force: true });
      }
    } catch {
      // Overlays are intermittent; never fail the test for cleanup.
    }
  }
}

module.exports = { OverlayHandler };
