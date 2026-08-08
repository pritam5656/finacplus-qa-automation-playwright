/**
 * Base for reusable UI fragments (sidebar, header, etc.).
 * Pages compose components — prefer composition over deep inheritance.
 */
class BaseComponent {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    if (new.target === BaseComponent) {
      throw new Error('BaseComponent is abstract and cannot be instantiated directly');
    }
    this.page = page;
  }
}

module.exports = { BaseComponent };
