import { expect, test } from '../src/fixtures/test';
import { accounts } from '../src/data/accounts';
import { LoginPage } from '../src/pages/login.page';
import { NotesPage } from '../src/pages/notes.page';

test(
  'login with a valid email and a wrong password stays on the login screen',
  { tag: ['@regression', '@auth', '@negative'] },
  async ({ page }) => {
    const loginPage = new LoginPage(page);
    const notesPage = new NotesPage(page);

    await loginPage.open();
    await loginPage.login(accounts.primary.email, 'not-the-password');

    await expect(loginPage.alert).toHaveText('Incorrect email address or password');
    await expect(page).toHaveURL(/\/notes\/app\/login$/);
    await expect(loginPage.heading).toBeVisible();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(notesPage.logoutButton).toHaveCount(0);
    await expect(notesPage.addNoteButton).toHaveCount(0);
  },
);
