const base = require('@playwright/test');
const { ApiClientFactory } = require('../factories/ApiClientFactory');

/** API fixture — injects user API client and service. */
const test = base.test.extend({
  apiFactory: async ({ request }, use) => {
    await use(new ApiClientFactory(request));
  },

  userApi: async ({ apiFactory }, use) => {
    await use(apiFactory.userApi());
  },

  userService: async ({ apiFactory }, use) => {
    await use(apiFactory.userService());
  },
});

module.exports = { test, expect: base.expect };
