# QA Automation

FinacPlus QA Automation Intern assignment.

Playwright end-to-end and API test suite for DemoQA Book Store and ReqRes.

## Stack

- Playwright (JavaScript)
- Page Object Model with reusable UI components
- Separate UI and API projects
- Environment-based configuration (`.env`)

## Prerequisites

- Node.js 20+
- DemoQA account ([register](https://demoqa.com/register) — CAPTCHA prevents automated signup)
- ReqRes API key from [app.reqres.in](https://app.reqres.in)

## Setup

```bash
npm install
npx playwright install chromium
cp .env.example .env
```

Fill in `.env`:

```env
DEMOQA_BASE_URL=https://demoqa.com
DEMOQA_USERNAME=your_demoqa_username
DEMOQA_PASSWORD=your_demoqa_password

REQRES_BASE_URL=https://reqres.in
REQRES_API_KEY=your_reqres_api_key
```

| Variable | Required | Description |
|----------|----------|-------------|
| `DEMOQA_USERNAME` | Yes | Book Store login |
| `DEMOQA_PASSWORD` | Yes | Book Store login |
| `REQRES_API_KEY` | Yes | `x-api-key` header for ReqRes |
| `DEMOQA_BASE_URL` | No | Defaults to `https://demoqa.com` |
| `REQRES_BASE_URL` | No | Defaults to `https://reqres.in` |

Never commit `.env`.

## Run tests

```bash
npm test              # UI + API
npm run test:ui       # UI only
npm run test:api      # API only
npm run test:headed   # UI headed (slowMo 1000ms)
npm run test:debug    # Playwright Inspector
npm run report        # open HTML report
npm run trace         # open a trace.zip
npm run test:submit   # run suite + export submission artifacts
```

`test:headed` uses `--headed` only. Playwright’s CLI does not support `--slow-mo`; delay is set in `playwright.config.js` via `launchOptions.slowMo` (1000ms when `--headed` is present, otherwise 0).

## What’s covered

**UI** (`tests/ui/bookStore.loginSearchLogout.spec.js`)

- Open DemoQA → Book Store Application
- Login and verify profile
- Search for *Learning JavaScript Design Patterns*
- Save title, author, publisher to `output/book-details.txt`
- Logout

**API** (`tests/api/users.crud.spec.js`)

- Create user (`POST /api/users`)
- Fetch user (`GET /api/users/:id`)
- Update user (`PUT /api/users/:id`)

## Project layout

```
├── artifacts/                    # committed test report for submission
│   ├── playwright-html-report.png
│   ├── playwright-report/
│   ├── book-details.txt
│   └── screenshots/              # report + individual UI flow shots
├── playwright.config.js
├── scripts/export-artifacts.js
├── src/
│   ├── config/
│   ├── constants/
│   ├── core/
│   ├── components/
│   ├── pages/
│   ├── factories/
│   ├── builders/
│   ├── fixtures/
│   ├── data/
│   ├── api/
│   └── utils/
└── tests/
    ├── ui/
    └── api/
```

**Adding coverage**

- New UI page → `src/pages` + wire in `PageFactory` / fixtures
- Shared widget → `src/components`
- New API client → implement under `src/api` and register in `ApiClientFactory`
- Payloads → `src/builders` or `src/data`

## Reporting & submission artifacts

Configured in `playwright.config.js`:

- HTML + list reporters
- Screenshot, video, and trace on failure

After a local run, regenerate the committed submission pack:

```bash
npm run test:submit
```

That writes:

| Artifact | Path |
|----------|------|
| Report overview screenshot | `artifacts/playwright-html-report.png` |
| Report + expanded/individual shots | `artifacts/screenshots/` |
| Live DemoQA step screenshots | `artifacts/screenshots/ui-flow/` |
| HTML report | `artifacts/playwright-report/` |
| Book details file | `artifacts/book-details.txt` |

Also produced locally (gitignored): `playwright-report/`, `test-results/`, `output/`.

```bash
npm run report
npx playwright show-trace test-results/<folder>/trace.zip
```

When emailing the assignment, attach:
- `artifacts/playwright-html-report.png`
- optionally expanded/individual shots from `artifacts/screenshots/`
- optionally UI flow shots from `artifacts/screenshots/ui-flow/`

When zipping the project for submission, include `artifacts/` — do **not** include `.env` or `node_modules/`.

## Notes

- DemoQA registration is manual because of CAPTCHA.
- ReqRes free-tier creates are not persisted; `GET` after create may return `404`. The suite validates the create response in that case, then continues with update.
- Ads on DemoQA can block clicks; `OverlayHandler` dismisses the fixed banner when present.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
