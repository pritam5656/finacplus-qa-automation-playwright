const { logger } = require('../../utils/logger');
const { ResponseParser } = require('./ResponseParser');

/**
 * Shared HTTP client helpers for parsing and status checks.
 * Domain APIs extend this class with their own methods.
 */
class BaseApiClient {
  /**
   * @param {import('@playwright/test').APIRequestContext} request
   * @param {typeof ResponseParser} [parser]
   */
  constructor(request, parser = ResponseParser) {
    if (new.target === BaseApiClient) {
      throw new Error('BaseApiClient is abstract and cannot be instantiated directly');
    }
    this.request = request;
    this.parser = parser;
  }

  async parseResponse(response) {
    return this.parser.parse(response);
  }

  async ensureStatus(response, action, expectedStatuses) {
    const { status, body, bodyText } = await this.parseResponse(response);
    logger.info(`${action}`, { status, url: response.url() });

    if (!expectedStatuses.includes(status)) {
      throw new Error(
        `${action} failed: expected status ${expectedStatuses.join(' or ')}, ` +
          `got ${status} from ${response.url()}. Body: ${bodyText.slice(0, 500)}`,
      );
    }

    return { status, body };
  }
}

module.exports = { BaseApiClient };
