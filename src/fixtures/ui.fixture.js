const base = require('@playwright/test');
const { PageFactory } = require('../factories/PageFactory');
const { env } = require('../config/env');

/**
 * UI fixture — DI container for page objects and credentials.
 */
const test = base.test.extend({
  credentials: async ({}, use) => {
    await use({
      username: env.demoqa.username(),
      password: env.demoqa.password(),
    });
  },

  pages: async ({ page }, use) => {
    await use(new PageFactory(page));
  },

  homePage: async ({ pages }, use) => {
    await use(pages.home());
  },

  loginPage: async ({ pages }, use) => {
    await use(pages.login());
  },

  profilePage: async ({ pages }, use) => {
    await use(pages.profile());
  },

  bookStorePage: async ({ pages }, use) => {
    await use(pages.bookStore());
  },
});

module.exports = { test, expect: base.expect };
