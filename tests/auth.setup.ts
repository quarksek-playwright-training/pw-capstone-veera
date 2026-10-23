import { test as setup } from '@playwright/test';
import { loginAccount, ensureAccount } from '../src/api/users';
import { writeSession } from '../src/auth/session';
import { accountList } from '../src/data/accounts';

setup('create persistent accounts and save their sessions', async ({ request }) => {
  for (const account of accountList) {
    await ensureAccount(request, account);
    const token = await loginAccount(request, account);
    await writeSession(account.key, token);
  }
});
