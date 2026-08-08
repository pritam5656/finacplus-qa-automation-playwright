const {
  expectStatus,
  expectEqual,
  expectTruthy,
  expectNotEqual,
} = require('../../utils/assertions');
const { logger } = require('../../utils/logger');

/**
 * Domain assertions for user API responses (SRP: validation only).
 * Keeps clients thin and specs free of repetitive expect blocks.
 */
class UserResponseValidator {
  static assertCreated(body, expected, status) {
    expectStatus(status, 201, 'Create user');
    expectTruthy(body.id, 'id');
    expectEqual(body.name, expected.name, 'name');
    expectEqual(body.job, expected.job, 'job');
    expectTruthy(body.createdAt, 'createdAt');
  }

  static assertUpdated(body, expected, previousName, status) {
    expectStatus(status, 200, 'Update user');
    expectEqual(body.name, expected.name, 'name');
    expectEqual(body.job, expected.job, 'job');
    expectTruthy(body.updatedAt, 'updatedAt');
    expectNotEqual(body.name, previousName, 'name');
  }

  /**
   * ReqRes free tier often returns 404 for freshly created IDs.
   * Validates live GET when available; otherwise falls back to create payload.
   */
  static assertGetOrCreateFallback({ status, body, userId, createBody, expected }) {
    if (status === 200) {
      const user = body.data || body;
      expectTruthy(user, 'user payload');
      if (user.name !== undefined) expectEqual(user.name, expected.name, 'name');
      if (user.job !== undefined) expectEqual(user.job, expected.job, 'job');
      return { mode: 'persisted' };
    }

    expectStatus(status, 404, 'Get non-persisted created user');
    expectEqual(String(createBody.id), userId, 'create response id');
    expectEqual(createBody.name, expected.name, 'create response name');
    expectEqual(createBody.job, expected.job, 'create response job');
    logger.warn(`GET ${userId} returned 404; validated create response instead`);
    return { mode: 'create-fallback' };
  }
}

module.exports = { UserResponseValidator };
