import { expect, test } from '../src/fixtures/test';
import { uniqueNote } from '../src/data/notes';
import { NotesPage } from '../src/pages/notes.page';

test(
  'a note created by one account is invisible to the other account',
  { tag: ['@regression', '@notes'] },
  async ({ primaryPage, secondaryPage, createdNotes }) => {
    const note = uniqueNote({
      title: 'Private primary note',
      description: 'Visible only to the primary account',
      category: 'Personal',
    });
    createdNotes.push({ account: 'primary', title: note.title });

    const primaryNotes = new NotesPage(primaryPage);
    await primaryNotes.open();
    await primaryNotes.create(note);
    await expect(primaryNotes.noteTitle(note.title)).toBeVisible();

    const secondaryNotes = new NotesPage(secondaryPage);
    await secondaryNotes.open();
    await secondaryNotes.waitForWorkspace();
    await expect(secondaryNotes.logoutButton).toBeVisible();
    await expect(secondaryNotes.noteTitle(note.title)).toHaveCount(0);

    await secondaryNotes.filterBy(note.category);
    await expect(secondaryNotes.noteTitle(note.title)).toHaveCount(0);
  },
);
