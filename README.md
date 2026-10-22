# Notes application Playwright framework

End-to-end tests for [the notes practice app](https://practice.expandtesting.com/notes/app).

## Run

```bash
npm ci
npx playwright install
npm test
```

Tag subsets:

```bash
npm run test:smoke
npm run test:regression
npm run test:auth
npm run test:notes
npm run test:negative
```

Chromium, Firefox, and WebKit run in CI. Auth setup creates two persistent accounts when they are missing, logs each one in, and saves the sessions under `.auth/`. That directory is gitignored. Note cleanup runs through the API after each test.
