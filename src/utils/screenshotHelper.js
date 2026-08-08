const fs = require('fs');
const path = require('path');

const UI_FLOW_DIR = path.resolve(process.cwd(), 'artifacts', 'screenshots', 'ui-flow');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

/**
 * Saves a full-page UI screenshot for assignment evidence.
 * @param {import('@playwright/test').Page} page
 * @param {string} name file stem, e.g. "01-home"
 */
async function captureUiStep(page, name) {
  ensureDir(UI_FLOW_DIR);
  const filePath = path.join(UI_FLOW_DIR, `${name}.png`);
  await page.screenshot({ path: filePath, fullPage: true });
  return filePath;
}

module.exports = { captureUiStep, UI_FLOW_DIR };
