const { expect } = require('@playwright/test');

/** Shared assertion helpers with clear failure messages. */
function expectStatus(actual, expected, context = 'HTTP response') {
  expect(actual, `${context}: expected status ${expected}, got ${actual}`).toBe(expected);
}

function expectStatusOneOf(actual, allowed, context = 'HTTP response') {
  expect(
    allowed,
    `${context}: expected one of [${allowed.join(', ')}], got ${actual}`,
  ).toContain(actual);
}

function expectEqual(actual, expected, fieldName) {
  expect(actual, `Expected ${fieldName} to be "${expected}", got "${actual}"`).toBe(expected);
}

function expectTruthy(value, fieldName) {
  expect(value, `Expected ${fieldName} to be present`).toBeTruthy();
}

function expectNotEqual(actual, unexpected, fieldName) {
  expect(actual, `Expected ${fieldName} to change from "${unexpected}"`).not.toBe(unexpected);
}

module.exports = {
  expectStatus,
  expectStatusOneOf,
  expectEqual,
  expectTruthy,
  expectNotEqual,
};
