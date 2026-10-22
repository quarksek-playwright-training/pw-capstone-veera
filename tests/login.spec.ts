import { expect, test } from '../src/fixtures/test';
import { ensureAccount } from '../src/api/users';
import { accounts } from '../src/data/accounts';
import { LoginPage } from '../src/pages/login.page';
import { NotesPage } from '../src/pages/notes.page';

test(
  'persistent account reaches the authenticated area after logging in',
  { tag: ['@smoke', '@auth'] },
  async ({ page, request }) => {
    const account = accounts.primary;
    // Ensure the account here so this login does not depend on the shared auth setup.
    await ensureAccount(request, account);

    const loginPage = new LoginPage(page);
    const notesPage = new NotesPage(page);

    await loginPage.open();
    await loginPage.login(account.email, account.password);

    await expect(page).toHaveURL(/\/notes\/app\/?$/);
    await expect(notesPage.logoutButton).toBeVisible();
    await expect(notesPage.addNoteButton).toBeVisible();
    await expect(loginPage.heading).toHaveCount(0);
  },
);
