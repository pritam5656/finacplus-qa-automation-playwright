/**
 * Single responsibility: turn a Playwright APIResponse into { status, body, bodyText }.
 */
class ResponseParser {
  /**
   * @param {import('@playwright/test').APIResponse} response
   */
  static async parse(response) {
    const status = response.status();
    const bodyText = await response.text();
    let body;

    try {
      body = bodyText ? JSON.parse(bodyText) : {};
    } catch {
      body = { raw: bodyText };
    }

    return { status, body, bodyText };
  }
}

module.exports = { ResponseParser };
