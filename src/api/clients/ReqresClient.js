const { BaseApiClient } = require('../core/BaseApiClient');
const { IUserApi } = require('../contracts/IUserApi');
const { endpoints } = require('../endpoints/reqres.endpoints');
const { env } = require('../../config/env');
const { logger } = require('../../utils/logger');

/** ReqRes implementation of the user API contract. */
class ReqresClient extends BaseApiClient {
  /**
   * @param {import('@playwright/test').APIRequestContext} request
   * @param {{ baseUrl?: string, apiKey?: () => string }} [config]
   */
  constructor(request, config = {}) {
    super(request);
    this.baseUrl = config.baseUrl || env.reqres.baseUrl;
    this._apiKey = config.apiKey || (() => env.reqres.apiKey());
  }

  /** @returns {typeof IUserApi} contract marker for docs / instanceof checks */
  static get contract() {
    return IUserApi;
  }

  headers() {
    return {
      'Content-Type': 'application/json',
      'x-api-key': this._apiKey(),
    };
  }

  async createUser(payload) {
    const response = await this.request.post(endpoints.users, {
      data: payload,
      headers: this.headers(),
    });
    return this.ensureStatus(response, 'POST /api/users', [201]);
  }

  async getUser(userId) {
    const response = await this.request.get(endpoints.userById(userId), {
      headers: this.headers(),
    });
    const parsed = await this.parseResponse(response);
    logger.info('GET /api/users/:id', { status: parsed.status, userId });
    return parsed;
  }

  async updateUser(userId, payload) {
    const response = await this.request.put(endpoints.userById(userId), {
      data: payload,
      headers: this.headers(),
    });
    return this.ensureStatus(response, `PUT /api/users/${userId}`, [200]);
  }
}

module.exports = { ReqresClient };
