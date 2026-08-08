# Contributing & Git practices

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/) so history stays scannable:

```
<type>(optional-scope): <short summary>
```

| Type | When |
|------|------|
| `feat` | New test coverage or framework capability |
| `fix` | Bug fix (flaky locator, wrong assertion, etc.) |
| `refactor` | Structure/readability with no behavior change |
| `docs` | README, CONTRIBUTING, comments |
| `test` | Test-only changes |
| `chore` | Tooling, deps, ignore files |

Examples:

```
feat(api): add ReqRes update-user coverage
fix(ui): stabilize Book Store search locator
refactor: introduce UI fixtures for page objects
docs: clarify .env setup for DemoQA credentials
```

Guidelines:

- Keep the subject under ~72 characters; imperative mood (“add”, not “added”)
- Explain *why* in the body when the diff is non-obvious
- One logical change per commit when practical
- Never commit `.env`, credentials, or generated artifacts (`test-results/`, `playwright-report/`, `output/`)

## Pull requests

- Describe what changed and how to verify (`npm run test:ui`, `npm run test:api`)
- Link related issues if any
- Confirm secrets were not included
