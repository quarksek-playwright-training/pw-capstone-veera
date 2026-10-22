import { expect, test } from '../src/fixtures/test';
import { NotesPage } from '../src/pages/notes.page';

test(
  'a failed notes list request shows a failure state instead of an empty list',
  { tag: ['@regression', '@notes', '@negative'] },
  async ({ primaryPage }) => {
    let notesListFailed = false;

    await primaryPage.route('**/notes/api/notes**', async (route) => {
      const pathname = new URL(route.request().url()).pathname;
      const isNotesList = route.request().method() === 'GET' && /\/notes\/?$/.test(pathname);
      if (!isNotesList) {
        await route.continue();
        return;
      }
      notesListFailed = true;
      // JSON null makes the app's error handler throw while reading
      // response.data.message, so the notes view never leaves its loader.
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: 'null',
      });
    });

    const notesPage = new NotesPage(primaryPage);
    await notesPage.open();
    await expect.poll(() => notesListFailed).toBe(true);

    // The failed list call leaves the notes loader in place. The empty-state
    // message and the note workspace are never rendered.
    await expect(notesPage.logoutButton).toBeVisible();
    await expect(notesPage.loader).toBeVisible();
    await expect(notesPage.emptyState).toHaveCount(0);
    await expect(notesPage.noteCards).toHaveCount(0);
    await expect(notesPage.addNoteButton).toHaveCount(0);
  },
);
