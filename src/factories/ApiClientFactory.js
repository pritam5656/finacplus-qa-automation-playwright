const { ReqresClient } = require('../api/clients/ReqresClient');
const { UserApiService } = require('../api/services/UserApiService');

/**
 * Builds API-layer collaborators. Swap ReqresClient for another IUserApi
 * implementation without changing fixtures or specs.
 */
class ApiClientFactory {
  /**
   * @param {import('@playwright/test').APIRequestContext} request
   */
  constructor(request) {
    this.request = request;
  }

  /** @returns {ReqresClient} concrete IUserApi */
  userApi() {
    return new ReqresClient(this.request);
  }

  userService(userApi = this.userApi()) {
    return new UserApiService(userApi);
  }
}

module.exports = { ApiClientFactory };
