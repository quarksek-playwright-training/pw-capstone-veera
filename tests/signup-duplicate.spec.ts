import { expect, test } from '../src/fixtures/test';
import { accounts } from '../src/data/accounts';
import { NotesPage } from '../src/pages/notes.page';
import { RegisterPage } from '../src/pages/register.page';

test(
  'signup rejects an email that already belongs to a persistent account',
  { tag: ['@regression', '@auth', '@negative'] },
  async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const notesPage = new NotesPage(page);
    const account = accounts.primary;

    await registerPage.open();
    await registerPage.register(account.name, account.email, account.password);

    await expect(registerPage.alert).toHaveText(
      'An account already exists with the same email address',
    );
    await expect(page).toHaveURL(/\/notes\/app\/register$/);
    await expect(registerPage.heading).toBeVisible();
    await expect(registerPage.submitButton).toBeVisible();
    await expect(registerPage.loginLink).toHaveCount(0);
    await expect(notesPage.logoutButton).toHaveCount(0);
  },
);
