/** Shared timeouts (ms) — keep magic numbers out of pages and config. */
const timeouts = {
  action: 15_000,
  navigation: 45_000,
  short: 1_500,
  medium: 15_000,
  long: 20_000,
  urlWait: 30_000,
  uiTest: 90_000,
  apiTest: 30_000,
};

module.exports = { timeouts };
