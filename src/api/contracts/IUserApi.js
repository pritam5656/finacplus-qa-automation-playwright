/**
 * Contract for user API operations.
 * Concrete clients implement these methods; services depend on this shape.
 */
class IUserApi {
  constructor() {
    if (new.target === IUserApi) {
      throw new Error('IUserApi is a contract and cannot be instantiated');
    }
  }

  /** @returns {Promise<{status: number, body: object}>} */
  async createUser(_payload) {
    throw new Error('createUser() not implemented');
  }

  /** @returns {Promise<{status: number, body: object}>} */
  async getUser(_userId) {
    throw new Error('getUser() not implemented');
  }

  /** @returns {Promise<{status: number, body: object}>} */
  async updateUser(_userId, _payload) {
    throw new Error('updateUser() not implemented');
  }
}

module.exports = { IUserApi };
