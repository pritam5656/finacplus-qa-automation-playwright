const { UserResponseValidator } = require('../validators/UserResponseValidator');
const { logger } = require('../../utils/logger');

/**
 * Orchestrates user API flows and validation.
 * Specs call this service; HTTP details stay in the injected client.
 */
class UserApiService {
  /**
   * @param {import('../contracts/IUserApi').IUserApi | object} userApi
   * @param {typeof UserResponseValidator} [validator]
   */
  constructor(userApi, validator = UserResponseValidator) {
    this.userApi = userApi;
    this.validator = validator;
  }

  async createAndValidate(payload) {
    const { status, body } = await this.userApi.createUser(payload);
    this.validator.assertCreated(body, payload, status);
    const userId = String(body.id);
    logger.info(`Created user id=${userId}`);
    return { userId, createBody: body };
  }

  async getAndValidate(userId, expected, createBody) {
    const { status, body } = await this.userApi.getUser(userId);
    return this.validator.assertGetOrCreateFallback({
      status,
      body,
      userId,
      createBody,
      expected,
    });
  }

  async updateAndValidate(userId, payload, previousName) {
    const { status, body } = await this.userApi.updateUser(userId, payload);
    this.validator.assertUpdated(body, payload, previousName, status);
    return { status, body };
  }
}

module.exports = { UserApiService };
