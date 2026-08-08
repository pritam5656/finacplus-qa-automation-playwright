/**
 * After a successful `npm test`, copies report outputs into `artifacts/`
 * and captures overview + individual expanded Playwright HTML report screenshots.
 */
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { chromium } = require('@playwright/test');

const ROOT = path.resolve(__dirname, '..');
const ARTIFACTS = path.join(ROOT, 'artifacts');
const SCREENSHOTS = path.join(ARTIFACTS, 'screenshots');
const REPORT_SRC = path.join(ROOT, 'playwright-report');
const REPORT_DST = path.join(ARTIFACTS, 'playwright-report');
const BOOK_SRC = path.join(ROOT, 'output', 'book-details.txt');
const BOOK_DST = path.join(ARTIFACTS, 'book-details.txt');
const PORT = 9323;

function copyDir(src, dst) {
  fs.rmSync(dst, { recursive: true, force: true });
  fs.cpSync(src, dst, { recursive: true });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function startReportServer() {
  return spawn(
    process.execPath,
    [
      require.resolve('@playwright/test/cli'),
      'show-report',
      REPORT_SRC,
      '--host',
      '127.0.0.1',
      '--port',
      String(PORT),
    ],
    { cwd: ROOT, stdio: 'ignore' },
  );
}

async function expandReportUi(page) {
  const collapsed = page.locator('.chip-header.expanded-false, [aria-expanded="false"]');
  const count = await collapsed.count();
  for (let i = 0; i < count; i += 1) {
    await collapsed.nth(i).click({ force: true }).catch(() => {});
  }

  const summaries = page.locator('summary.expandable-summary, details > summary');
  const summaryCount = await summaries.count();
  for (let i = 0; i < summaryCount; i += 1) {
    const summary = summaries.nth(i);
    const parent = summary.locator('xpath=ancestor::details[1]');
    const isOpen = await parent.getAttribute('open').catch(() => null);
    if (isOpen === null) {
      await summary.click({ force: true }).catch(() => {});
    }
  }

  const steps = page.locator('.tree-item');
  const stepCount = await steps.count();
  for (let i = 0; i < stepCount; i += 1) {
    await steps.nth(i).click({ force: true }).catch(() => {});
  }

  await wait(600);
}

async function shot(page, fileName) {
  const filePath = path.join(SCREENSHOTS, fileName);
  await page.screenshot({ path: filePath, fullPage: true });
  return filePath;
}

async function captureScreenshots() {
  fs.mkdirSync(SCREENSHOTS, { recursive: true });

  // Keep UI flow screenshots from the test run; only refresh report shots here
  for (const file of fs.readdirSync(SCREENSHOTS)) {
    if (file.endsWith('.png') && !file.startsWith('ui-flow')) {
      // leave directory entries alone
      const full = path.join(SCREENSHOTS, file);
      if (fs.statSync(full).isFile()) fs.unlinkSync(full);
    }
  }

  const server = startReportServer();
  const saved = [];

  try {
    await wait(2000);
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
    const base = `http://127.0.0.1:${PORT}`;

    await page.goto(`${base}/#?`, { waitUntil: 'networkidle' });
    await wait(1000);
    await expandReportUi(page);
    saved.push(await shot(page, '01-report-overview.png'));
    fs.copyFileSync(saved[0], path.join(ARTIFACTS, 'playwright-html-report.png'));

    await page.goto(`${base}/#?q=s%3Apassed`, { waitUntil: 'networkidle' });
    await wait(800);
    await expandReportUi(page);
    saved.push(await shot(page, '02-report-passed-filter.png'));

    await page.goto(`${base}/#?`, { waitUntil: 'networkidle' });
    await wait(800);
    const tests = await page.evaluate(() => {
      const links = [...document.querySelectorAll('a[href*="testId="]')];
      const seen = new Set();
      const out = [];
      for (const link of links) {
        const href = link.getAttribute('href') || '';
        if (!href.includes('testId=') || seen.has(href)) continue;
        seen.add(href);
        const title = (link.innerText || '').trim().replace(/\s+/g, ' ');
        const project = /bookStore|DemoQA|login/i.test(title)
          ? 'ui'
          : /users\.crud|ReqRes|create/i.test(title)
            ? 'api'
            : `test-${out.length + 1}`;
        out.push({ href, title, project });
      }
      return out;
    });

    if (!tests.length) {
      throw new Error('No individual test links found in Playwright HTML report');
    }

    let index = 3;
    for (const test of tests) {
      await page.goto(`${base}/${test.href}`, { waitUntil: 'networkidle' });
      await wait(1000);

      // Compact detail (steps only)
      saved.push(await shot(page, `${String(index).padStart(2, '0')}-test-${test.project}-detail.png`));
      index += 1;

      // Expanded detail (stdout + chips + steps clicked open)
      await expandReportUi(page);
      saved.push(
        await shot(page, `${String(index).padStart(2, '0')}-test-${test.project}-expanded.png`),
      );
      index += 1;
    }

    await browser.close();
    return { saved, tests };
  } finally {
    server.kill('SIGTERM');
  }
}

async function main() {
  if (!fs.existsSync(path.join(REPORT_SRC, 'index.html'))) {
    throw new Error('Missing playwright-report/index.html — run `npm test` first.');
  }

  fs.mkdirSync(ARTIFACTS, { recursive: true });
  copyDir(REPORT_SRC, REPORT_DST);

  if (fs.existsSync(BOOK_SRC)) {
    fs.copyFileSync(BOOK_SRC, BOOK_DST);
  }

  const { saved, tests } = await captureScreenshots();

  const uiFlowDir = path.join(SCREENSHOTS, 'ui-flow');
  const uiFlowShots = fs.existsSync(uiFlowDir)
    ? fs.readdirSync(uiFlowDir).filter((f) => f.endsWith('.png')).sort()
    : [];

  console.log('Artifacts ready:');
  console.log(`  - ${path.relative(ROOT, REPORT_DST)}/`);
  console.log(`  - ${path.relative(ROOT, path.join(ARTIFACTS, 'playwright-html-report.png'))}`);
  if (fs.existsSync(BOOK_DST)) {
    console.log(`  - ${path.relative(ROOT, BOOK_DST)}`);
  }
  console.log(`  - report screenshots (${saved.length}):`);
  for (const file of saved) {
    console.log(`      ${path.relative(ROOT, file)}`);
  }
  console.log(`  - ui-flow screenshots (${uiFlowShots.length}):`);
  for (const file of uiFlowShots) {
    console.log(`      artifacts/screenshots/ui-flow/${file}`);
  }
  console.log(`  - individual tests captured: ${tests.map((t) => t.project).join(', ')}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
