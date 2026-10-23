import { request as newRequest, test as base, type Browser, type BrowserContext, type Page } from '@playwright/test';
import { deleteNotesByTitle } from '../api/notes';
import { authFile, readToken } from '../auth/session';
import { appBaseURL } from '../config';
import type { AccountKey } from '../data/accounts';
import { blockAds } from '../support/ads';

export type CreatedNote = {
  account: AccountKey;
  title: string;
};

type Fixtures = {
  createdNotes: CreatedNote[];
  primaryPage: Page;
  secondaryPage: Page;
};

async function openAuthenticatedPage(
  browser: Browser,
  account: AccountKey,
  use: (page: Page) => Promise<void>,
): Promise<void> {
  const context = await browser.newContext({
    baseURL: appBaseURL,
    storageState: authFile(account),
  });
  await prepareContext(context);
  const page = await context.newPage();
  await use(page);
  await context.close();
}

async function prepareContext(context: BrowserContext): Promise<void> {
  await blockAds(context);
}

export const test = base.extend<Fixtures>({
  context: async ({ context }, use) => {
    await prepareContext(context);
    await use(context);
  },

  createdNotes: async ({}, use) => {
    const notes: CreatedNote[] = [];
    await use(notes);
  },

  primaryPage: async ({ browser }, use) => {
    await openAuthenticatedPage(browser, 'primary', use);
  },

  secondaryPage: async ({ browser }, use) => {
    await openAuthenticatedPage(browser, 'secondary', use);
  },
});

test.afterEach(async ({ createdNotes }) => {
  if (createdNotes.length === 0) {
    return;
  }

  const api = await newRequest.newContext({ baseURL: appBaseURL });
  try {
    for (const note of createdNotes) {
      const token = readToken(note.account);
      await deleteNotesByTitle(api, token, note.title);
    }
  } finally {
    await api.dispose();
  }
});

export { expect } from '@playwright/test';
